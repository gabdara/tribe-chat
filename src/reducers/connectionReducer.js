import {
  ADD_CONNECTION,
  REMOVE_CONNECTION,
  SET_CONNECTED
} from '../actions/connectionActions';

function connectionReducer(state = [], action) {
  switch (action.type) {
    case ADD_CONNECTION:
      return [...state, action.payload];

    case REMOVE_CONNECTION:
      const i = state.findIndex(c => c.address === action.payload);
      return [...state].splice(i, 1);

    case SET_CONNECTED:
      return state.map((c) => {
        if (c.address !== action.address) return c;
        return { ...c, connected: action.payload };
      });

    default:
      return state;
  }
}

export default connectionReducer;