import React, { Component } from 'react';
import { Image } from 'semantic-ui-react';

class UserItem extends Component {
  render() {
    const { name, avatar } = this.props.user;

    const classNames = ['UserItem'];
    if (this.props.connected !== undefined) {
      classNames.push('-connection');
      if (this.props.connected) classNames.push('-connected');
      else classNames.push('-disconnected');
    }

    return (
      <div className={classNames.join(' ')}>
        <Image src={avatar} circular={true} />
        <strong>{name}</strong>
      </div>
    );
  }
}

export default UserItem;