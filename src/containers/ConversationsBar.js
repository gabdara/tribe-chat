import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Divider } from 'semantic-ui-react';
import ConnectionModal from '../components/ConversationsBar/ConnectionModal';
import UserItem from '../components/UserItem';

import { addFriend } from '../actions/friendActions';
import { addConnection } from '../actions/connectionActions';

class ConversationsBar extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.openModal = this.openModal.bind(this);
    this.handleModalCancel = this.handleModalCancel.bind(this);
    this.handleModalAdd = this.handleModalAdd.bind(this);
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

  render() {
    return (
      <div className="ConversationsBar">
        <Button color="green" onClick={this.openModal}>Add connection</Button>
        <ConnectionModal open={this.state.open} address={this.props.address} onCancel={this.handleModalCancel} onAdd={this.handleModalAdd} />
        <Divider />
        <div>
          <ul>
            {this.props.connections.map((connection, key) =>
              <li className={connection.connected ? 'selected' : ''} key={key}>
                <UserItem user={connection} connected={connection.connected ? true : false} key={key} />
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
    connections: state.friends.map(friend => {
      const connection = state.connections.find(c => c.address === friend.address);
      return { ...friend, connected: connection.connected };
    })
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rxAddConnection: (address) => {
      dispatch(addFriend({ address }));
      dispatch(addConnection({ address }));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationsBar);