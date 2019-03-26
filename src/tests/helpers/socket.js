/* eslint-disable import/no-extraneous-dependencies */
const { token } = require('../../server/middlewares/authentication');
const { NotificationTypes } = require('../../server/models');
const io = require('socket.io-client');

const validUserToken = token({
  id: 'cjl6fecrb11115vf09xly2f65',
  roleId: 3,
  username: 'Steve Akinyemi',
});

const invalidUserToken = 'hhdsgdgdssdhbshjbvoc';

const newNotification = NotificationTypes.create({ name: 'NEW' });

class ClientSocket {
  constructor(url) {
    // Connects to the server at teh url.
    this.socket = io(url);

    // Display a message when server is connected to
    this.socket.on('connect', () => {
      this.id = this.socket.io.engine.id;
      console.log('[client] Client id', this.id);
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

  disconnect() {
    this.socket.disconnect();
  }
}

const createClientSocketEnvironment = (port, token) => {
  localStorage.setItem('token', token);
  return new ClientSocket(`http://localhost:${port}`);
};

module.exports = {
  validUserToken,
  invalidUserToken,
  createClientSocketEnvironment,
  newNotification,
};
