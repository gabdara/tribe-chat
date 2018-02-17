export const EMPTY_CONNECTION = {
  address: null,
  connected: false
};

export const ADD_CONNECTION = 'ADD_CONNECTION';
export function addConnection(connection) {
  return {
    type: ADD_CONNECTION,
    payload: { ...EMPTY_CONNECTION, ...connection }
  };
}

export const REMOVE_CONNECTION = 'REMOVE_CONNECTION';
export function removeConnection(address) {
  return {
    type: REMOVE_CONNECTION,
    payload: address
  };
}

export const SET_CONNECTED = 'SET_CONNECTED';
export function setConnected(address, connected) {
  return {
    type: SET_CONNECTED,
    payload: connected,
    address
  };
}