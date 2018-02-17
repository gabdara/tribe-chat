import React, { Component } from 'react';
import { connect } from 'react-redux';
import DecentralizedFS from '../libs/DecentralizedFS';
import DecentralizedP2P from '../libs/DecentralizedP2P';
import { isUserSignedIn, loadUserData, Person } from 'blockstack';

import { Grid } from 'semantic-ui-react';
import SignIn from '../components/SignIn';
import HeaderBar from '../components/HeaderBar';
import ConversationsBar from '../containers/ConversationsBar';
import ChatWindow from '../containers/ChatWindow';

import defaultAvatar from '../assets/default-user-avatar.svg';
import anonymousAvatar from '../assets/default-friend-avatar.svg';
import 'semantic-ui-css/semantic.min.css';
import '../styles/App.css';

import { setUser, setAddress } from '../actions/userActions';
import { setConnected } from '../actions/connectionActions';
import { displayConversation, addConversation, addMessage } from '../actions/conversationActions';
import {
  setName as setFriendName,
  setUsername as setFriendUsername,
  setAvatar as setFriendAvatar
} from '../actions/friendActions';

const dfs = new DecentralizedFS();
const p2p = {};

class App extends Component {
  constructor(props) {
    super(props);
    this.handleMakeConnection = this.handleMakeConnection.bind(this);
    this.handleSaveMessage = this.handleSaveMessage.bind(this);
  }

  handleMakeConnection(address) {
    const dp2p = new DecentralizedP2P();
    p2p[address] = dp2p;
    dp2p.establishConnection(address);

    dp2p.on('connected', () => {
      this.props.rxSetConnectionStatus(address, true);
    });
    dp2p.on('connected:person', (person) => {
      this.props.rxConnectedFriend(address, person);
    });
    dp2p.on('disconnected', () => {
      this.props.rxSetConnectionStatus(address, false);
    });
    dp2p.on('ready', () => {
      console.log('rrr', dp2p.getLatestMessages());
      this.props.rxDisplayConversation(address);
      this.props.rxAddConversation(address, dp2p.getLatestMessages());
    });
    dp2p.on('message:received', (msg) => {
      this.handleReceiveMessage(address, msg);
    });
  }

  handleReceiveMessage(address, text) {
    const msg = {
      user: 1,
      text,
      date: Date.now()
    };
    this.props.rxAddMessage(address, msg);
  }

  handleSaveMessage(msg) {
    const dp2p = p2p[this.props.displayConversation];
    dp2p.sendMessage(msg);
  }

  componentWillMount() {
    if (!isUserSignedIn()) return;
    dfs.on('ready', (address) => this.props.rxSetUserAddress(address));
    this.props.rxSetUser(getSignedInUser());
  }

  render() {
    return (
      <div className="App">
        {!isUserSignedIn()
          ? <SignIn />
          : <div className="TribeChat">
            <HeaderBar data={{ user: this.props.user, friend: this.props.chatFriend }} />
            <div className="MainWindow">
              <Grid padded>
                <Grid.Column width={4}>
                  <ConversationsBar onMakeConnection={this.handleMakeConnection} />
                </Grid.Column>
                <Grid.Column width={12}>
                  {this.props.displayConversation
                    ? <ChatWindow onSendMessage={this.handleSaveMessage} />
                    : ''
                  }
                </Grid.Column>
              </Grid>
            </div>
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    displayConversation: state.displayConversation,
    chatFriend: state.friends.find(f => f.address === state.displayConversation)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rxSetUser: (user) => {
      return dispatch(setUser(user));
    },
    rxSetUserAddress: (address) => {
      return dispatch(setAddress(address));
    },
    rxSetConnectionStatus: (address, connected) => {
      return dispatch(setConnected(address, connected));
    },
    rxConnectedFriend: (address, friend) => {
      dispatch(setFriendName(address, friend.name));
      dispatch(setFriendUsername(address, friend.username));
      dispatch(setFriendAvatar(address, friend.avatarUrl));
    },
    rxDisplayConversation: (address) => {
      return dispatch(displayConversation(address));
    },
    rxAddConversation: (address, messages) => {
      return dispatch(addConversation({ address, messages: messages }));
    },
    rxAddMessage: (address, msg) => {
      return dispatch(addMessage(address, msg));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

function getSignedInUser() {
  const userData = loadUserData();
  const profile = new Person(loadUserData().profile);
  return {
    address: dfs.address,
    name: profile.name(),
    username: userData.username,
    avatar: profile.avatarUrl()
  };
}