import {
  DISPLAY_CONVERSATION,
  ADD_CONVERSATION,
  ADD_MESSAGE
} from '../actions/conversationActions';

export function displayConversation(state = null, action) {
  switch (action.type) {
    case DISPLAY_CONVERSATION:
      return action.payload;

    default:
      return state;
  }
}

export function conversations(state = [], action) {
  switch (action.type) {
    case ADD_CONVERSATION:
      return [...state, action.payload];

    case ADD_MESSAGE:
      return state.map((c) => {
        if (c.address !== action.address) return c;
        return { ...c, messages: [...c.messages, action.payload] };
      });

    default:
      return state;
  }
}