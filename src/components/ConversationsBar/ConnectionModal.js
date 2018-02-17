import React, { Component } from 'react';
import { Button, Input, Modal } from 'semantic-ui-react';

class ConnectionModal extends Component {
  constructor(props) {
    super(props);
    this.state = { guestAddress: '' };
    this.handleAddress = this.handleAddress.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  handleAddress(e, data) {
    this.setState({ guestAddress: data.value });
  }

  handleAdd() {
    this.props.onAdd(this.state.guestAddress);
  }

  render() {
    return (
      <Modal className="ConnectionModal" open={this.props.open} size='mini' inverted='true'>
        <Modal.Header>Add a new connection</Modal.Header>
        <Modal.Content>
          <div className="my-identifier">
            <strong>My identifier</strong>
            <div>{this.props.address}</div>
          </div>
          <Input placeholder='Friend identifier' onChange={this.handleAddress} fluid />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.props.onCancel}>Cancel</Button>
          <Button onClick={this.handleAdd} disabled={!this.state.guestAddress.length} positive>Add</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ConnectionModal;