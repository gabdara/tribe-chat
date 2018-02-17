import React, { Component } from 'react';
import UserTopBar from './HeaderBar/UserTopBar';
import ConversationTopBar from './HeaderBar/ConversationTopBar';
import { Grid } from 'semantic-ui-react';

class HeaderBar extends Component {
  render() {
    const { user, friend } = this.props.data;

    return (
      <div className="HeaderBar">
        <Grid padded>
          <Grid.Column width={4}>
            <UserTopBar user={user} />
          </Grid.Column>
          <Grid.Column width={12}>
            <ConversationTopBar user={friend} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default HeaderBar;