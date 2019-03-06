const Chat = require('../server/models').Chats;
const sendRequest = require('./sendRequest');

const testPayload = {
  userEmail: 'batian.muthoga@andela.com',
  chat: 'This is a sample chat message',
};

let chatId;
const chatsEndpoint = '/api/incidents/cjfkubrlv0001tsjksuis3/chats';

describe('Chat tests', () => {
  beforeEach(done => {
    sendRequest('post', chatsEndpoint, testPayload, (err, res) => {
      expect(res.body.data).toHaveProperty('id');
      chatId = res.body.data.id;
      done();
    });
  });

  it('should fail to add a chat with wrong payload', done => {
    sendRequest('post', chatsEndpoint, null, (err, res) => {
      expect(res.body.message).toEqual('"chat" is required');
      done();
    });
  });

  afterEach(done => {
    Chat.destroy({ where: { id: chatId } }).then(() => {
      chatId = null;
      done();
    });
  });
});
