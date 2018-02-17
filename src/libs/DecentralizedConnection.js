import jwt from 'jsonwebtoken';
import Peer from 'simple-peer';
import DFS from './DecentralizedFS';

const CONNECTION_SIGNAL_FILE = 'signal.json';

const fs = new DFS();

const defaultConnectionEventHandler = {
  onError: (err) => console.log('error', err),
  onSignal: (signal) => console.log('signal', signal),
  onConnect: () => console.log('CONNECTED'),
  onDisconnect: () => console.log('DISCONNECTED'),
  onMessageReceived: (msg) => console.log('message', msg),
};

class DecentralizedConnection {
  constructor(guestAddress, options = {}) {
    this.guestAddress = guestAddress;
    this.opt = { ...defaultConnectionEventHandler, ...options };
    this.peer = null;
  }

  /**
   * Relative path of P2P signal on host
   * @returns {String}
   */
  get hostSignalPath() {
    return fs.address + '/' + CONNECTION_SIGNAL_FILE;
  }

  /**
   * Relative path of P2P signal on host
   * @returns {String}
   */
  get guestSignalPath() {
    return this.guestAddress + '/' + CONNECTION_SIGNAL_FILE;
  }

  get connected() {
    return this.peer && this.peer.connected;
  }

  establishConnection() {
    this.makeConnection();
    const ci = setInterval(() => {
      if (this.connected) {
        clearInterval(ci);
        return;
      }
      this.makeConnection();
    }, 1000 * 10);
  }

  async makeConnection() {
    const guest = await this.searchSignal();
    if (!guest) {
      this.makePeer(true); // make host initiator
    } else {
      if (guest.initiator) this.makePeer(false);
      if (!this.peer) this.makePeer(true); // make host initiator
      this.setSignal(guest.signal);
    }
  }

  makePeer(initiator = false) {
    this.peer = new Peer({ initiator, trickle: false, reconnectTimer: 100 });
    this.peer.on('error', this.opt.onError);
    this.peer.on('signal', async (data) => {
      const signal = encodeSignal(data);
      await this.writeSignal(initiator, signal);
      this.opt.onSignal(signal);
    });
    this.peer.on('connect', this.opt.onConnect);
    this.peer.on('close', () => {
      this.opt.onDisconnect();
      this.establishConnection();
    });
    this.peer.on('data', (data) => {
      const msg = JSON.parse('' + data);
      this.opt.onMessageReceived(msg);
    });
  }

  sendMessage(msg) {
    if (!isValidMessage(msg)) return;
    this.peer.send(JSON.stringify(msg));
  }

  /**
   * Search guest signal
   * @returns {Promise} { initiator, signal }
   */
  searchSignal() {
    return new Promise(async (resolve) => {
      try {
        let data = await fs.readData(this.guestSignalPath, { address: this.guestAddress });
        if (data && decodeSignal(data.signal)) resolve(data);
        else resolve(null);
      } catch (error) {
        if (error.name !== "TokenExpiredError") throw error;
        resolve(null);
      }

    });
  }

  setSignal(signal) {
    this.peer.signal(decodeSignal(signal));
  }

  writeSignal(initiator, signal) {
    return fs.writeData(this.hostSignalPath, { initiator, signal });
  }
}

export default DecentralizedConnection;

function encodeSignal(signal) {
  return jwt.sign(signal, 'chat-signal', { expiresIn: '10s' });
}

function decodeSignal(signal) {
  return jwt.verify(signal, 'chat-signal');
}

function isValidMessage(msg) {
  return (msg !== undefined && msg !== null) || Number.isInteger(msg) || !!Object.keys(msg).length;
}