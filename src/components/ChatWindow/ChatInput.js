import React, { Component } from 'react';
import { Form, Button, Icon } from 'semantic-ui-react';

class ChatInput extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange(e) {
    this.setState({ text: e.target.value });

  }

  handleKeyPress(e) {
    const code = (e.keyCode ? e.keyCode : e.which);
    if (code === 13) { //Enter keycode
      e.preventDefault();
      if (this.state.text === '') return;
      this.props.onSend(this.state.text);
      this.setState({ text: '' });
    }
  }

  render() {
    return (
      <div className="ChatInput">
        <Form>
          <Form.TextArea placeholder='Send a message ...' value={this.state.text} onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
        </Form>
        <div className="chat-addons">
          <Button icon basic>
            <Icon name='smile' size="big" />
          </Button>
          <Button icon basic>
            <Icon name='image' size="big" />
          </Button>
        </div>
      </div>
    );
  }
}

export default ChatInput;