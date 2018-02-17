export const DISPLAY_CONVERSATION = 'DISPLAY_CONVERSATION';
export function displayConversation(address) {
  return {
    type: DISPLAY_CONVERSATION,
    payload: address
  };
}

export const ADD_CONVERSATION = 'ADD_CONVERSATION';
export function addConversation(conversation) {
  return {
    type: ADD_CONVERSATION,
    payload: conversation
  };
}

export const ADD_MESSAGE = 'ADD_MESSAGE';
export function addMessage(address, msg) {
  return {
    type: ADD_MESSAGE,
    payload: msg,
    address
  };
}