import EventEmitter from 'events';
import DFS from './DecentralizedFS';

const MESSAGES_FOLDER = '/messages/';
const BLOCK_FILENAME = 'block';
const BLOCK_SIZE = 10;

const fs = new DFS();
const s = Symbol();

class DecentralizedMessages extends EventEmitter {
  constructor(guestAddress) {
    super();
    this.guestAddress = guestAddress;
    this[s] = new _DecentralizedMessages(this);
  }

  get ready() {
    if (this[s].block) return true;
    console.log('DecentralizedMessages not ready');
    return true;
  }

  async saveMessage(msg) {
    if (!this.ready) return;
    const completed = await this[s].completeBlock();
    if (completed) msg.index = 0;
    else msg.index = this[s].block.messages.length;
    this[s].block.messages.push(msg);
    return this[s].writeMessage(msg, this[s].block.index);
  }

  getMessages() {
    if (!this.ready) return;
    return this[s].block.messages.concat();
  }
}

export default DecentralizedMessages;

class _DecentralizedMessages {
  constructor(self) {
    this.self = self;
    this.initBlock();
  }

  get guestAddress() {
    return this.self.guestAddress;
  }

  /**
   * Relative path of messages folder
   * @returns {String}
   */
  get messagesPath() {
    return this.guestAddress + MESSAGES_FOLDER;
  }

  async initBlock() {
    this.block = await this.readBlock();
    if (!this.block) this.block = await this.createNewCurrentBlock();
    if (!this.block) throw new Error('DecentralizedMessages: could not set initial block');
    console.log('DecentralizedMessages is ready', this.guestAddress);
    this.self.emit('ready');
  }

  getMessagePath(blockIndex, msgIndex) {
    return this.messagesPath + BLOCK_FILENAME + '-' + blockIndex + '/' + msgIndex + '.json';
  }

  getBlockPath(index = null) {
    return this.messagesPath + BLOCK_FILENAME + (index === null ? '' : '-' + index) + '.json';
  }

  createNewCurrentBlock(index = 0) {
    return new Promise(async (resolve) => {
      const block = { index, messages: [] };
      await this.writeBlock(block, true);
      resolve(block);
    });
  }

  /**
   * Write block when it has BLOCK_SIZE messages and create a new block
   * @todo remove single messages
   */
  completeBlock() {
    let block = this.block;
    return new Promise(async (resolve) => {
      if (!isCompleteBlock(block)) return resolve(false);
      await this.writeBlock(block);
      block = await this.createNewCurrentBlock(block.index + 1);
      return resolve(true);
    });
  }

  readBlock(index = null) {
    return new Promise(async (resolve) => {
      const block = await fs.readData(this.getBlockPath(index));
      if (!block) return resolve(null);
      if (!block.messages.length) {
        for (let i = 0; i < BLOCK_SIZE; ++i) {
          const msg = await fs.readData(this.getMessagePath(block.index, i));
          if (msg) block.messages.push(msg);
        }
      }
      return resolve(block);
    });
  }

  writeBlock(block, current = false) {
    return fs.writeData(this.getBlockPath(current ? null : block.index), block);
  }

  writeMessage(msg, blockIndex) {
    return fs.writeData(this.getMessagePath(blockIndex, msg.index), msg);
  }

  cleanBlockMessages() {
    return new Promise((resolve) => {
      const messages = this.block.messages;
      let no = messages.length;
      if (no === 0) resolve();
      messages.forEach(async (msg) => {
        await fs.deleteFile(this.getMessagePath(this.block.index, msg.index));
        no = no - 1;
        if (no === 0) resolve();
      });
    });
  }
}

function isCompleteBlock(block) {
  return block.messages.length === BLOCK_SIZE;
}
