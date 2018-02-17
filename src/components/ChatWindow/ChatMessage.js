import React, { Component } from 'react';
import { Image } from 'semantic-ui-react';

class ChatMessage extends Component {
  render() {
    const { username, name, avatar, text, rightSide } = this.props.message;

    return (
      <div className={['ChatMessage', rightSide ? '-right' : '-left'].join(' ')}>
        {!rightSide ? <Image src={avatar} circular={true} size="mini" /> : ''}
        <div className="msg-bubble">
          <strong>{name || username}</strong>
          <span>{text}</span>
        </div>
        {rightSide ? <Image src={avatar} circular={true} size="mini" /> : ''}
      </div>
    );
  }
}

export default ChatMessage;