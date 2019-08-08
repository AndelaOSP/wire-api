const { sendRequest } = require('./helpers/request');
const { postChat } = require('../server/middlewares/index');

const webChatsEndpoint = '/api/chats';

const testwebChat = {
  text: 'I ama chat posted from wire web!!',
  incidentId: 'cjfkubrlv0003tgxs3mre',
};

const testwebChat2 = {
  text: '',
  incidentId: 'cjfkubrlv0001tgxs3mre',
};

const testwebChat3 = {
  text: 'I ama chat posted from wire web!!',
  incidentId: 'noneexisting-hbjef',
};

// eslint-disable-next-line max-lines-per-function
describe('web chat tests', () => {
  it('should fail when empty chat text is empty', done => {
    sendRequest('post', webChatsEndpoint, testwebChat2, (err, res) => {
      expect(res.body.status).toEqual('failure');
      expect(res.body.message).toEqual('Text is required');
      done();
    });
  });
  it('should fail if invalid token is provided', done => {
    sendRequest(
      // eslint-disable-next-line prettier/prettier
      'post', webChatsEndpoint, testwebChat,(err, res) => {
        expect(res.status).toEqual(401);
      },
      'some-invalidtoken'
    );
    done();
  });
  it('should fail if wrong incident id is passed', done => {
    sendRequest('post', webChatsEndpoint, testwebChat3, (err, res) => {
      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual('incident not found');
    });
    done();
  });
  it('should fail if wrong channelID id is passed', done => {
    let res = postChat.postChat(
      'some random chat',
      'channelIDThatdoesNotExist'
    );
    res.then(slackRes => {
      expect(slackRes.error).toEqual('channel_not_found');
      expect(slackRes.ok).toEqual(false);
      done();
    });
  });

  it('should not call external api', done => {
    postChat.postChat = jest.fn();
    postChat.postChat('I ama chat posted from wire web!!', 'GLC1G3M0W');
    expect(postChat.postChat).toHaveBeenCalledWith(
      'I ama chat posted from wire web!!',
      'GLC1G3M0W'
    );
    done();
  });
  it('test post chat throws error', done => {
    postChat.postChat = jest.fn();
    postChat.postChat.mockImplementation(() => {
      throw new Error();
    });
    expect(postChat.postChat).toThrowError();
    done();
  });
});
