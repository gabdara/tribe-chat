import React, { Component } from 'react';
import UserItem from '../UserItem';

class ConversationTopBar extends Component {
  render() {
    return (
      <div className="ConversationTopBar">
        {this.props.user
          ? <UserItem user={this.props.user} big connected />
          : ''
        }
      </div>
    );
  }
}

export default ConversationTopBar;