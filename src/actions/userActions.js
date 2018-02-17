import defaultAvatar from '../assets/default-user-avatar.svg';

export const USER_DEFAULT_AVATAR = defaultAvatar;
export const EMPTY_USER = {
  address: null,
  name: 'Me',
  username: null,
  avatar: USER_DEFAULT_AVATAR
};

export const SET_USER = 'SET_USER';
export function setUser(user) {
  return {
    type: SET_USER,
    payload: user
  };
}

export const USER_SET_ADDRESS = 'USER_SET_ADDRESS';
export function setAddress(address) {
  return {
    type: USER_SET_ADDRESS,
    payload: address
  };
}

export const USER_SET_NAME = 'USER_SET_NAME';
export function setName(name) {
  return {
    type: USER_SET_NAME,
    payload: name
  };
}

export const USER_SET_USERNAME = 'USER_SET_USERNAME';
export function setUsername(username) {
  return {
    type: USER_SET_USERNAME,
    payload: username
  };
}

export const USER_SET_AVATAR = 'USER_SET_AVATAR';
export function setAvatar(avatar) {
  return {
    type: USER_SET_AVATAR,
    payload: avatar
  };
}