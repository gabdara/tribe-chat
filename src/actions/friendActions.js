import defaultAvatar from '../assets/default-friend-avatar.svg';
import { EMPTY_USER } from './userActions';

export const FRIEND_DEFAULT_AVATAR = defaultAvatar;
export const EMPTY_FRIEND = {
  ...EMPTY_USER,
  name: 'Anonymous',
  avatar: FRIEND_DEFAULT_AVATAR
};

export const ADD_FRIEND = 'ADD_FRIEND';
export function addFriend(friend) {
  return {
    type: ADD_FRIEND,
    payload: { ...EMPTY_FRIEND, ...friend }
  };
}

export const REMOVE_FRIEND = 'REMOVE_FRIEND';
export function removeFriend(address) {
  return {
    type: REMOVE_FRIEND,
    payload: address
  };
}

export const FRIEND_SET_ADDRESS = 'FRIEND_SET_ADDRESS';
export function setAddress(username, address) {
  return {
    type: FRIEND_SET_ADDRESS,
    payload: address,
    username
  };
}

export const FRIEND_SET_NAME = 'FRIEND_SET_NAME';
export function setName(address, name) {
  return {
    type: FRIEND_SET_NAME,
    payload: name,
    address
  };
}

export const FRIEND_SET_USERNAME = 'FRIEND_SET_USERNAME';
export function setUsername(address, username) {
  return {
    type: FRIEND_SET_USERNAME,
    payload: username,
    address
  };
}

export const FRIEND_SET_AVATAR = 'FRIEND_SET_AVATAR';
export function setAvatar(address, avatar) {
  return {
    type: FRIEND_SET_AVATAR,
    payload: avatar,
    address
  };
}