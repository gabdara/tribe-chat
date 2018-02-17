import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import {
  isSignInPending,
  redirectToSignIn,
  handlePendingSignIn
} from 'blockstack';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = { pending: false };
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  componentWillMount() {
    if (!isSignInPending()) return;
    this.setState({ pending: true });
    handlePendingSignIn().then((userData) => {
      window.location = window.location.origin;
    });
  }

  handleSignIn() {
    this.setState({ pending: true });
    const origin = window.location.origin;
    redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data']);
  }

  render() {
    const { pending } = this.state;

    return (
      <div className="SignIn">
        <div>
          <h1>Tribe Chat</h1>
          <Button disabled={pending} onClick={this.handleSignIn} size="massive" >
            {pending ? 'Signing in ...' : 'Sign in with Blockstack'}
          </Button>
        </div>
      </div>
    );
  }
}

export default SignIn;
