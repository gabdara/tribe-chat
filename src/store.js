// StoreSchema = {
//   user: {
//     address,
//     name,
//     username,
//     avatar
//   },
//   friends: [
//     {
//       address,
//       name,
//       username,
//       avatar
//     }
//   ],
//   connections: [
//     {
//       address,
//       connected,
//     }
//   ],
//   conversations: [
//     {
//       address,
//       messages: [
//         {
//           user,
//           text,
//           date
//         }
//       ]
//     }
//   ],
//   displayConversation: address
// };

import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import user from './reducers/userReducer';
import friends from './reducers/friendReducer';
import connections from './reducers/connectionReducer';
import { displayConversation, conversations } from './reducers/conversationReducer';

export default createStore(
  combineReducers({ user, friends, connections, displayConversation, conversations }),
  {},
  applyMiddleware(thunk, promise(), logger)
);