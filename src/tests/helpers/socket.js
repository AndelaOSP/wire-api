/* eslint-disable import/no-extraneous-dependencies */
const { token } = require('../../server/middlewares/authentication');
const io = require('socket.io-client');

const validUserToken = token({
  id: 3453,
  roleId: 3,
  username: 'Batian Muthoga',
});

const invalidUserToken = '';

class ClientSocket {
  constructor(url) {
    // Connects to the server at teh url.
    this.socket = io(url);

    // Display a message when server is connected to
    this.socket.on('connect', () => {
      this.emitNewConnection();
    });
  }

  // eslint-disable-next-line class-methods-use-this
  emitNewConnection() {
    // Get token from cookie.
    const token = localStorage.getItem('token');
    this.socket.emit('new-connection', { token });
  }

  subscribeToNotifyCC(func) {
    // Do something with the data recieved.
    this.socket.on('notify-cc', data => {
      func(data);
    });
  }
}

module.exports = {
  validUserToken,
  invalidUserToken,
  ClientSocket,
};
