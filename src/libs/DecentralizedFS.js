import EventEmitter from 'events';
import lz from 'lzutf8';
import {
  BLOCKSTACK_DEFAULT_GAIA_HUB_URL,
  BLOCKSTACK_STORAGE_LABEL,
  BLOCKSTACK_GAIA_HUB_LABEL,
  isUserSignedIn,
  decryptECIES,
  connectToGaiaHub,
  loadUserData,
  getFile,
  putFile,
  deleteFile
} from 'blockstack';

const s = Symbol();

class DecentralizedFS extends EventEmitter {
  constructor() {
    super();
    this[s] = new _DecentralizedFS(this);
  }

  get ready() {
    if (!this[s].ready) console.log('DecentralizedFS not ready');
    return this[s].ready;
  }

  /**
   * Getter address
   * Compressed Gaia URL
   */
  get address() {
    if (!this.ready) return '';
    return lz.compress(getGaiaHubUrl(), { outputEncoding: 'Base64' });
  }

  readData(dpath, options = {}) {
    if (!this.ready) return '';
    const defaults = {
      decrypt: false,
      username: null,
      app: window.location.origin,
      zoneFileLookupURL: 'https://core.blockstack.org/v1/names/'
    };
    const opt = Object.assign({}, defaults, options);

    let content = '';
    return new Promise(async (resolve) => {
      if (opt.address !== undefined) {
        const gaiaUrl = lz.decompress(opt.address, { inputEncoding: 'Base64' }) + dpath;
        content = await fetchGaiaUrl(gaiaUrl, opt);
      } else {
        content = await getFile(dpath, opt);
      }
      resolve(JSON.parse(content));
    });
  }

  writeData(dpath, content = '', options) {
    if (!this.ready) return '';
    if (typeof dpath !== 'string' || dpath === '') {
      throw new Error('DecentralizedFS::writeData() : Invalid path');
    }
    return putFile(dpath, JSON.stringify(content), options);
  }

  /**
   * Not supported yet by Gaia
   * @param {String} dpath 
   */
  deleteFile(dpath) {
    return deleteFile(dpath);
  }
}

export default DecentralizedFS;

class _DecentralizedFS {
  constructor(self) {
    this.self = self;
    this.ready = false;
    this.init();
  }

  init() {
    if (isUserSignedIn()) {
      if (window.connectingToHub) {
        // connection already in progress
        const ci = setInterval(() => {
          if (!window.connectingToHub) {
            clearInterval(ci);
            this.makeHubConnection();
          }
        }, 1000);
      } else this.makeHubConnection();
    } else {
      console.log('Login before using DecentralizedFS');
    }
  }

  makeHubConnection() {
    setLocalGaiaHubConnection().then(() => {
      this.ready = true;
      console.log('DecentralizedFS ready', getGaiaHubUrl());
      this.self.emit('ready', this.self.address);
    });
  }
}

function fetchGaiaUrl(gaiaUrl, opt) {
  return fetch(gaiaUrl).then((response) => {
    if (response.status !== 200) {
      if (response.status === 404) {
        console.log(`getData ${gaiaUrl} returned 404, returning null`);
        return null;
      } else {
        throw new Error(`getData ${gaiaUrl} failed with HTTP status ${response.status}`);
      }
    }
    const contentType = response.headers.get('Content-Type');
    if (contentType === null || opt.decrypt ||
      contentType.startsWith('text') ||
      contentType === 'application/json') {
      return response.text();
    } else {
      return response.arrayBuffer();
    }
  }).then((storedContents) => {
    if (opt.decrypt && storedContents !== null) {
      const privateKey = loadUserData().appPrivateKey;
      const cipherObject = JSON.parse(storedContents);
      return decryptECIES(privateKey, cipherObject);
    } else {
      return storedContents;
    }
  });
}

function getGaiaHubUrl() {
  const { url_prefix, address } = getGaiaHubConfig();
  return url_prefix + address + '/';
}

function getGaiaHubConfig() {
  return JSON.parse(localStorage.getItem(BLOCKSTACK_GAIA_HUB_LABEL));
}

function setLocalGaiaHubConnection() {
  if (getGaiaHubConfig()) return new Promise(resolve => resolve(getGaiaHubConfig()));

  const userData = loadUserData();
  if (!userData.hubUrl) {
    userData.hubUrl = BLOCKSTACK_DEFAULT_GAIA_HUB_URL;
    localStorage.setItem(BLOCKSTACK_STORAGE_LABEL, JSON.stringify(userData));
  }

  window.connectingToHub = true;
  return connectToGaiaHub(userData.hubUrl, userData.appPrivateKey).then((gaiaConfig) => {
    localStorage.setItem(BLOCKSTACK_GAIA_HUB_LABEL, JSON.stringify(gaiaConfig));
    window.connectingToHub = false;
    return gaiaConfig;
  });
}