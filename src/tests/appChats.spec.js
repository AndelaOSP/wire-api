const {sendRequest} = require('./helpers/request');

const appChatEndpoint = '/api/chats';

const testappChat = {
  text: "Hello, World!!"
};

const testappChat2 = {
  text: ""
};

describe('appChat Tests', () => {

  it('should create a appChat given the correct payload', done => {
    sendRequest('post', appChatEndpoint, testappChat, (err, req) => {
      setTimeout(() => {
        expect(req.body.status).toEqual('success');
        done();
      }, 4000);
    });
  });

  it('should create a appChat given the wrong payload', done => {
    sendRequest('post', appChatEndpoint, testappChat2, (err, req) => {
      setTimeout(() => {
        expect(req.body.status).toEqual('failure');
        done();
      }, 4000);
    });
  });

});