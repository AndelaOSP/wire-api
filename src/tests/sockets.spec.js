/* eslint-disable max-lines-per-function */
const { sendRequest, serverSocket, server } = require('./helpers/request');
const {
  ccdRequestBody,
  makeServerCall,
  addAssignee,
} = require('./helpers/incidents');
const {
  validUserToken,
  invalidUserToken,
  createClientSocketEnvironment,
} = require('./helpers/socket');

const port = 3000;
server.listen(port);

describe('Socket tests', () => {
  it('should save client socket id if valid token is provided', done => {
    const clientSocket = createClientSocketEnvironment(port, validUserToken);

    sendRequest(
      'post',
      '/api/users/login',
      { email: 'eugene.omar@andela.com' },
      (err, res) => {
        expect(res.body.message).toEqual('You were successfully logged in');
        done();
      }
    );

    setTimeout(() => {
      expect(serverSocket.clientIds).toHaveProperty(clientSocket.id);
      clientSocket.disconnect();
    }, 1000);
  });

  it('should not save client socket id if invalid token is provided', done => {
    const clientSocket = createClientSocketEnvironment(port, invalidUserToken);

    sendRequest(
      'post',
      '/api/users/login',
      { email: 'eugene.omar@andela.com' },
      (err, res) => {
        expect(res.body.message).toEqual('You were successfully logged in');
        done();
      }
    );

    setTimeout(() => {
      expect(serverSocket.clientIds).not.toHaveProperty(clientSocket.id);
      clientSocket.disconnect();
    }, 1000);
  });

  it('should not save client socket id if no token is provided', done => {
    const clientSocket = createClientSocketEnvironment(port, undefined);

    sendRequest(
      'post',
      '/api/users/login',
      { email: 'eugene.omar@andela.com' },
      (err, res) => {
        expect(res.body.message).toEqual('You were successfully logged in');
        done();
      }
    );

    setTimeout(() => {
      expect(serverSocket.clientIds).not.toHaveProperty(clientSocket.id);
      clientSocket.disconnect();
    }, 1000);
  });

  it('should save client id when an incident cc is updated', done => {
    const clientSocket = createClientSocketEnvironment(port, validUserToken);

    clientSocket.subscribeToNotifyCC(() => {});

    makeServerCall(ccdRequestBody, done, 'put', addAssignee);

    setTimeout(() => {
      expect(serverSocket.clientIds).toHaveProperty(clientSocket.id);
      clientSocket.disconnect();
    }, 1000);
  });

  afterAll(done => server.close(done));
});
