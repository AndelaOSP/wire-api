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

    // Client associations [[socketId, userId, token], ...]
    // REVIEW: Should this be stored in the Db?
    this.clients = [];

    // Set up connections
    this.establishConnection();
  }

  /**
   * Sets up what happens when there is a new connection or disconnection.
   **/
  establishConnection() {
    // Using promise to get the socket value
    this.connection = new Promise(resolve => {
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
    socket.on('new-connection', token => {
      console.log(
        `[server] client (${socket.id}): ${JSON.stringify(token, null, 2)}`
      );

      // TODO: Successful token verification only works through Postman currently. Need to investigate
      // Authenticate user and register to list of connected clients.
      // const userDetails = this.authenticate(token, socket);

      // Register client
      // this.registerClient(userDetails);
    });
  }

  /**
   * Registers client details in this.clients
   * @param userDetails object
   **/
  registerClient(userDetails) {
    userDetails.then(({ socket, user, token }) => {
      this.clients.push([socket.id, user.id, token]);
    });
  }

  /**
   * Does cleanup when a client disconnects
   * @param socket object
   **/
  handleDisconnection(socket) {
    socket.on('disconnect', () =>
      console.log(`[server] A client (${socket.id}) just disconnected!`)
    );

    // Remove client from list of connected clients.
    this.clients = this.clients.filter(item => item[0] != socket.id);
  }

  /**
   * TODO: Successful token verification only works through Postman currently. Need to investigate
   * Authenticates a new connected client
   * @param token string
   * @param socket object
   **/
  authenticate(token, socket) {
    return new Promise(resolve =>
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          console.log(`[server] (${socket.id}) token cannot be verified!`);
        } else {
          // Do something with decoded token.
          console.log(
            `[server] (${socket.id}) ${JSON.stringify(decoded, null, 2)}!`
          );

          resolve({ socket, decoded, token });
        }
      })
    );
  }

  /**
   * TODO: Should emit message to clients with userIds but authentication doesn't work yet
   * Sends a response back to the client to update its UI on notify-cc
   * @param userIds array
   * @param message string
   **/
  notifyCCChange(userIds, message) {
    this.connection.then(socket => {
      socket.emit('notify-cc', { message });
    });
  }
}

module.exports = server => new Socket(server);
