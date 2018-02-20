import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Divider } from 'semantic-ui-react';
import ConnectionModal from '../components/ConversationsBar/ConnectionModal';
import UserItem from '../components/UserItem';

import { addFriend } from '../actions/friendActions';
import { addConnection } from '../actions/connectionActions';
import { displayConversation } from '../actions/conversationActions';

class ConversationsBar extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.openModal = this.openModal.bind(this);
    this.handleModalCancel = this.handleModalCancel.bind(this);
    this.handleModalAdd = this.handleModalAdd.bind(this);
    this.handleConversationClick = this.handleConversationClick.bind(this);
  }

  openModal() {
    this.setState({ open: true });
  }

  handleModalCancel() {
    this.setState({ open: false });
  }

  handleModalAdd(address) {
    this.setState({ open: false });
    this.props.rxAddConnection(address);
    this.props.onMakeConnection(address);
  }

  handleConversationClick(e) {
    const address = e.currentTarget.dataset.address;
    if (address === this.props.displayConversation) return;
    this.props.rxDisplayConversation(address);
    console.log(e.currentTarget.dataset.address);
  }

  render() {
    return (
      <div className="ConversationsBar">
        <Button color="green" onClick={this.openModal}>Add connection</Button>
        <ConnectionModal open={this.state.open} address={this.props.address} onCancel={this.handleModalCancel} onAdd={this.handleModalAdd} />
        <Divider />
        <div>
          <ul>
            {this.props.connections.map((connection, key) =>
              <li key={key} className={connection.selected ? 'selected' : ''} data-address={connection.address} onClick={this.handleConversationClick}>
                <UserItem user={connection} connected={connection.connected ? true : false} />
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    address: state.user.address,
    displayConversation: state.displayConversation,
    connections: state.friends.map(friend => {
      const connection = state.connections.find(c => c.address === friend.address);
      const item = { ...friend, connected: connection.connected };
      if (friend.address === state.displayConversation) item.selected = true;
      return item;
    })
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rxAddConnection: (address) => {
      dispatch(addFriend({ address }));
      dispatch(addConnection({ address }));
    },
    rxDisplayConversation: (address) => {
      return dispatch(displayConversation(address));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationsBar);