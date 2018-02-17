import {
  FRIEND_DEFAULT_AVATAR,
  EMPTY_FRIEND,
  ADD_FRIEND,
  REMOVE_FRIEND,
  FRIEND_SET_ADDRESS,
  FRIEND_SET_NAME,
  FRIEND_SET_USERNAME,
  FRIEND_SET_AVATAR
} from '../actions/friendActions';

function friendReducer(state = [], action) {
  switch (action.type) {
    case ADD_FRIEND:
      return [...state, action.payload];

    case REMOVE_FRIEND:
      return [...state]; // @todo

    case FRIEND_SET_ADDRESS:
      return state.map((friend) => {
        if (friend.username !== action.username) return friend;
        return { ...friend, address: action.payload };
      });

    case FRIEND_SET_NAME:
      return state.map((friend) => {
        if (friend.address !== action.address) return friend;
        return { ...friend, name: action.payload ? action.payload : EMPTY_FRIEND.name };
      });

    case FRIEND_SET_USERNAME:
      return state.map((friend) => {
        if (friend.address !== action.address) return friend;
        return { ...friend, username: action.payload };
      });

    case FRIEND_SET_AVATAR:
      return state.map((friend) => {
        if (friend.address !== action.address) return friend;
        return { ...friend, avatar: action.payload ? action.payload : FRIEND_DEFAULT_AVATAR };
      });

    default:
      return state;
  }
}

export default friendReducer;