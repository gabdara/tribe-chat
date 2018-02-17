import EventEmitter from 'events';
import Connection from './DecentralizedConnection';
import Messages from './DecentralizedMessages';
import { loadUserData, Person } from 'blockstack';

const s = Symbol();

class DecentralizedP2P extends EventEmitter {
  constructor() {
    super();
    this[s] = new _DecentralizedP2P(this);
  }

  establishConnection(guestAddress) {
    if (!guestAddress) throw new Error('Invalid guest address');
    this.guestAddress = guestAddress;
    this[s].makeConnection();
  }

  sendMessage(msg) {
    this[s].connection.sendMessage(msg);
    this.emit('message:sent', msg);
  }

  getLatestMessages() {
    return this[s].messages.getMessages();
  }
}

export default DecentralizedP2P;

class _DecentralizedP2P {
  constructor(self) {
    this.self = self;
    this.connection = null;
    this.messages = null;
    this.initEvents();
  }

  get guestAddress() {
    return this.self.guestAddress;
  }

  initEvents() {
    const self = this.self;

    self.on('ready', () => {
      console.log('DecentralizedP2P is ready');
    });

    self.on('error', (err) => {
      console.log('guest: ', this.guestAddress);
      console.log('error: ', err);
    });

    self.on('signal', (signal) => {
      console.log('guest: ', this.guestAddress);
      console.log('signal: ', signal);
    });

    self.on('connected', () => {
      console.log('CONNECTED: ', this.guestAddress);
      this.connection.sendMessage({ person: getUserProfile() });
      if (this.messages.ready) self.emit('ready');
    });

    self.on('connected:person', (person) => {
      console.log('PERSON: ', person);
    });

    self.on('disconnected', () => {
      console.log('DISCONNECTED: ', this.guestAddress);
    });

    self.on('message:received', (msg) => {
      console.log('guest: ', this.guestAddress);
      console.log('message:received: ', msg);
      this.messages.saveMessage({
        user: 1,
        text: msg
      });
    });

    self.on('message:sent', (msg) => {
      console.log('guest: ', this.guestAddress);
      console.log('message:sent: ', msg);
      this.messages.saveMessage({
        user: 0,
        text: msg
      });
    });
  }

  makeConnection() {
    const self = this.self;
    this.messages = new Messages(this.guestAddress);
    this.messages.on('ready', () => {
      if (this.connection.connected) self.emit('ready');
    });

    const connectionHandler = {
      onError: (err) => self.emit('error', err),
      onSignal: (signal) => self.emit('signal', signal),
      onConnect: () => self.emit('connected'),
      onDisconnect: () => self.emit('disconnected'),
      onMessageReceived: (msg) => {
        if (msg.person !== undefined) self.emit('connected:person', msg.person);
        else self.emit('message:received', msg);
      }
    };
    this.connection = new Connection(this.guestAddress, connectionHandler);
    this.connection.establishConnection();
  }
}

function getUserProfile() {
  const userData = loadUserData();
  const profile = new Person(loadUserData().profile);
  profile.username = userData.username;
  return profile;
}