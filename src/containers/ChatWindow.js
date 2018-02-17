import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChatDisplay from '../components/ChatWindow/ChatDisplay';
import ChatInput from '../components/ChatWindow/ChatInput';

import { addMessage } from '../actions/conversationActions';

class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  handleSendMessage(text) {
    const msg = {
      user: 0,
      text,
      date: Date.now()
    };
    this.props.rxAddMessage(this.props.address, msg);
    this.props.onSendMessage(text);
  }

  render() {
    return (
      <div className="ChatWindow">
        <ChatDisplay messages={this.props.messages} />
        <ChatInput onSend={this.handleSendMessage} />
      </div>
    );
  }
}

function getMessages(state) {
  const conversation = state.conversations.find(c => c.address === state.displayConversation);
  if (!conversation) return [];
  const friend = state.friends.find(c => c.address === conversation.address);
  return conversation.messages.map((msg) => {
    const message = {
      text: msg.text,
      date: msg.date,
      rightSide: !msg.user
    };

    if (msg.user) {
      message.name = friend.name;
      message.username = friend.username;
      message.avatar = friend.avatar;
    } else {
      message.name = state.user.name;
      message.username = state.user.username;
      message.avatar = state.user.avatar;
    }

    return message;
  });
}

function mapStateToProps(state) {
  return {
    address: state.displayConversation,
    messages: getMessages(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rxAddMessage: (address, msg) => {
      return dispatch(addMessage(address, msg));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow);