# Tribe Chat

### A decentralized P2P chat with end-to-end encryption

__Built with Blockstack, React, Redux and WebRTC__

Not one centralized server is used to facilitate communication or store data.

Peers can find themselves using a decentralized signaling approach built on Gaia Hub and connect using the WebRTC protocol.
Each Blockstack user can use its identifier (a hash of his Gaia Hub URL) or its Blockstack Id to connect and chat with any other user.

Messages are saved decentralized and preserved between sessions.

It works both in LAN and across networks.

WebRTC opens the posibility of real-time audio and/or video calls, as well as direct data transfers between connected peers.

## Demo
https://tribe-chat.herokuapp.com

## Install locally
```
git clone https://github.com/gabdara/tribe-chat.git
npm install
npm start
```
If the Blockstack Sign in hangs on getting details please use an "Allow CORS" browser addon.

## Usage considerations

- this is at a very alpha stage in development, things might break.
- connection can be established only by exchanging identifer of Gaia Hub. Usage of Blockstack Id will come in a later version.
- establishing a connection between 2 peers has a small delay because first it tries to restore previous messages. Optimizations will be made in further releases.
- messages are stored and restored when the same 2 peers connect again, but the peers are not saved as friends between browser sessions yet.
- multiple conversations between 2 peers can be established, but not a multi-peer conversation yet.