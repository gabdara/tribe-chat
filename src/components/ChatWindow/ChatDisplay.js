import React, { Component } from 'react';
import ChatMessage from './ChatMessage';

class ChatDisplay extends Component {
  render() {
    return (
      <div className="ChatDisplay">
        <div>
          {this.props.messages.map((msg, key) =>
            <ChatMessage message={msg} key={key} />
          )}
        </div>
      </div>
    );
  }
}

export default ChatDisplay;