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
  ClientSocket,
} = require('./helpers/socket');

const port = 3000;
server.listen(port);

describe('Socket tests', () => {
  // beforeEach(done => {
  //   clientSocket = new ClientSocket(`http://wire.andela.com:${port}`);
  // });
  it('token valid', done => {
    const clientSocket = new ClientSocket(`http://wire.andela.com:${port}`);
    localStorage.setItem('token', validUserToken);
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
      console.log('>>> clients', serverSocket.clients);
      clientSocket.disconnect();
    }, 1000);
  });

  it('token invalid', done => {
    const clientSocket = new ClientSocket(`http://wire.andela.com:${port}`);
    localStorage.setItem('token', invalidUserToken);
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
      console.log('>>> clients', serverSocket.clients);
      clientSocket.disconnect();
    }, 1000);
  });

  it('no token', done => {
    const clientSocket = new ClientSocket(`http://wire.andela.com:${port}`);
    localStorage.setItem('token', undefined);
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
      console.log('>>> clients', serverSocket.clients);
      clientSocket.disconnect();
    }, 1000);
  });

  it('should update an incident when it has assignees', done => {
    const clientSocket = new ClientSocket(`http://wire.andela.com:${port}`);
    localStorage.setItem('token', validUserToken);
    clientSocket.subscribeToNotifyCC(() => {});
    makeServerCall(ccdRequestBody, done, 'put', addAssignee);
    setTimeout(() => {
      console.log('>>> clients', serverSocket.clients);
      clientSocket.disconnect();
    }, 1000);
  });

  // afterEach(done => {
  //   clientSocket.disconnect();
  //   // done();
  // });

  afterAll(done => server.close(done));
});
