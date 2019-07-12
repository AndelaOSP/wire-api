/* eslint-disable no-console */
require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

/**
 * A class for managing server-side socket connections.
 **/
class Socket {
  constructor(server) {
    // Connect socket to running server
    this.io = require('socket.io')(server);

    // Add cors for socket
    this.io.origins('*:*');

    // Client associations { userId: [socketId, token], ... }
    // REVIEW: Should this be stored in the Db?
    this.clients = {};

    // Holds client socket ids
    this.clientIds = {};

    // Set up connections
    this.establishConnection();
  }

  /**
   * Sets up what happens when there is a new connection or disconnection.
   **/
  establishConnection() {
    // Using promise to get the socket value
    this.connection = new Promise(resolve => {
      console.log('[server] Ready for connection');
      // The following happens when a new connection is established.
      this.io.on('connection', socket => {
        // Handle new connections
        this.handleNewConnection(socket);

        // Handle disconnections
        this.handleDisconnection(socket);

        // Make socket the Promise data
        resolve(socket);
      });
    });
  }

  /**
   * Handles new client connections
   * @param socket object
   **/
  handleNewConnection(socket) {
    console.log(`[server] A client (${socket.id}) just connected!`);
    // Do something with the data recieved.
    socket.on('new-connection', ({ token }) => {
      // Authenticate user and register to list of connected clients.
      const userDetails = this.authenticate(token, socket);

      // Register client
      this.registerClient(userDetails);
    });
  }

  /**
   * Registers client details in this.clients
   * @param userDetails object
   **/
  registerClient(userDetails) {
    userDetails.then(({ socket, user, token }) => {
      this.clientIds[socket.id] = {};
      this.clients[user.id] = [socket.id, token];
    });
  }

  /**
   * Does cleanup when a client disconnects
   * @param socket object
   **/
  handleDisconnection(socket) {
    socket.on('disconnect', () => {
      console.log(`[server] A client (${socket.id}) just disconnected!`);

      delete this.clientIds[socket.id];

      // Remove client from list of connected clients.
      let entries = Object.entries(this.clients).filter(
        ([, value]) => value[0] !== socket.id
      );

      this.clients = entries.reduce((prev, [key, value]) => {
        prev[key] = value;
        return prev;
      }, {});
    });
  }

  /**
   * Authenticates a new connected client
   * @param token string
   * @param socket object
   **/
  authenticate(token, socket) {
    return new Promise(resolve =>
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          console.log(err);
        } else {
          resolve({ socket, user: decoded, token });
        }
      })
    );
  }

  /**
   * Sends a response back to the client to update its UI on notify-cc
   * @param userIds array
   * @param message string
   **/
  notifyCCChange(userIds, message) {
    this.connection.then(() => {
      // Notify each user affected
      this.messageToUsers(userIds, 'notify-cc', message);
    });
  }
  notifyIncidentStatusChange(users, message) {
    this.connection.then(() => {
      this.messageToUsers(users, 'notify-status', message);
    });
  }
  /**
   * Sends a response back to the client to update its UI on notify-cc
   * @param userIds array
   * @param message string
   **/
  messageToUsers(userIds, eventName, message) {
    userIds.forEach(id => {
      const client = this.clients[id];
      client && this.io.to(`${client[0]}`).emit(eventName, { message });
    });
  }
}

module.exports = server => new Socket(server);
