import {
  USER_DEFAULT_AVATAR,
  EMPTY_USER,
  SET_USER,
  USER_SET_ADDRESS,
  USER_SET_NAME,
  USER_SET_USERNAME,
  USER_SET_AVATAR
} from '../actions/userActions';

function userReducer(state = EMPTY_USER, action) {
  switch (action.type) {
    case SET_USER:
      const nextState = { ...state, ...action.payload };
      if (!nextState.name) nextState.name = EMPTY_USER.name;
      if (!nextState.avatar) nextState.avatar = USER_DEFAULT_AVATAR;
      return nextState;

    case USER_SET_ADDRESS:
      return { ...state, address: action.payload };

    case USER_SET_NAME:
      return { ...state, name: action.payload ? action.payload : EMPTY_USER.name };

    case USER_SET_USERNAME:
      return { ...state, username: action.payload };

    case USER_SET_AVATAR:
      return { ...state, avatar: action.payload ? action.payload : USER_DEFAULT_AVATAR };

    default:
      return state;
  }
}

export default userReducer;