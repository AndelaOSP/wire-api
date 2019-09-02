const {sendRequest} = require('./helpers/request');

const testSlackEvent = {
  "event": {
    "type": "message",
    "text": "For inline help type wire chat help at any time any place",
    "user": "UHC32KE69",
    "ts": "1554121824.018400",
    "channel": "CGXDP5NQM",
    "event_ts": "1554121824.018400",
    "channel_type": "channel"
  },
  "event_id": "EvHJD54099",
  "event_time": "1554121824",
};

const testSlackEvent2 = {
  "event": {
    "type": "message",
    "text": "Tokens for Your Workspace",
    "user": "UGYGTEMTM",
    "ts": "1554121824.018400",
    "channel": "1234567",
    "event_ts": "1554121824.018400",
    "channel_type": "channel"
  },
  "event_id": "EvHJD54097",
  "event_time": "1554121824",
};

const testSlackEvent3 =
  {
    token: 'gUevdAHWJG6rKHWyjo3aaT7T',
    team_id: 'TGX3UHAM8',
    api_app_id: 'AHC1KDL5B',
    event:
      {
        client_msg_id: 'b35c818b-3434-4965-b033-b95007f96da3',
        type: 'message',
        text: 'Twitter/Facebook style',
        user: 'UGYGTEMTQ',
        ts: '1554828958.031500',
        channel: 'CGXDP5NQM',
        event_ts: '1554828958.031500',
        channel_type: 'channel'
      },
    type: 'event_callback',
    event_id: 'EvHQFNGJE5',
    event_time: 1554828958,
    authed_users: ['UHC32KE69']
  };


const testUrlVerification = {
  "token": "Jhj5dZrVaK7ZwHHjRyZWjbDl",
  "challenge": "3eZbrw1aBm2rZgRNFdxV2595E9CY3gmdALWMmHkvFXO7tYXAYM8P",
  "type": "url_verification"
};

const slackEventEndpoint = '/api/slack/chats';

describe('SlackEvent Tests', () => {

  it('should return a response for urlVerification', done => {
    sendRequest('post', slackEventEndpoint, testUrlVerification, (err, res) => {
      expect(res.body.data).toHaveProperty('type');
      expect(res.body.status).toMatch('success');
      done();
    });
  });

  it('should create a SlackEvent given the correct payload', done => {
    sendRequest('post', slackEventEndpoint, testSlackEvent, (err, req) => {
      setTimeout(() => {
        expect(req.body.status).toEqual('success');
        done();
      }, 4000);
    });
  });
  it('should not create a SlackEvent twice', done => {
    sendRequest('post', slackEventEndpoint, testSlackEvent, (err, req) => {
      expect(req.body.message).toEqual('id must be unique');
      done();
    });
  });

  it('should create a SlackEvent given a new user', done => {
    sendRequest('post', slackEventEndpoint, testSlackEvent3, (err, req) => {
      expect(req.body.status).toEqual('success');
      done();
    });
  });
});
