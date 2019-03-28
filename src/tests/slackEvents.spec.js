const {sendRequest} = require('./helpers/request');

const testSlackEvent = {
  "token": "gUevdAHWJG6rKHWyjo3aaT7T",
  "team_id": "TGX3UHAM8",
  "api_app_id": "AHC1KDL5B",
  "event": {
    "client_msg_id": "368af3ca-bcd9-4793-b8b2-064c01e04d95",
    "type": "message",
    "text": "For inline help type wire chat help at any time any place",
    "user": "UGYGTEMTQ",
    "ts": "1554121824.018400",
    "channel": "CGXDP5NQM",
    "event_ts": "1554121824.018400",
    "channel_type": "channel"
  },
  "type": "event_callback",
  "event_id": "EvHJD54095",
  "event_time": "1554121824",
  "authed_users": [
    "UHC32KE69"
  ]
};

const testSlackEvent2 = {
  "token": "gUevdAHWJG6rKHWyjo3aaT7T",
  "team_id": "TGX3UHAM8",
  "api_app_id": "AHC1KDL5B",
  "event": {
    "client_msg_id": "368af3ca-bcd9-4793-b8b2-064c01e04d95",
    "type": "message",
    "text": "For inline help type wire chat help at any time",
    "user": null,
    "ts": "1554121824.018400",
    "channel": "1234567",
    "event_ts": "1554121824.018400",
    "channel_type": "channel"
  },
  "type": "event_callback",
  "event_id": "EvHJD54097",
  "event_time": "1554121824",
  "authed_users": [
    null
  ]
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
      expect(res.body.status).toMatch('success');
      done();
    });
  });

  it('should create a SlackEvent given the correct payload', done => {
    sendRequest('post', slackEventEndpoint, testSlackEvent, (err, req) => {
      setTimeout(() => {
        expect(req.body.status).toEqual('success');
        done();
      }, 3000);
    });
  });

  it('should not create a SlackEvent given the wrong payload', done => {
      sendRequest('post', slackEventEndpoint, testSlackEvent2, (err, req) => {
        setTimeout(() => {
          expect(req.body.status).toEqual('success');
          done();
        }, 3000);
      });
  });


  it('should not create a SlackEvent twice', done => {
    sendRequest('post', slackEventEndpoint, testSlackEvent, (err, req) => {
      expect(req.body.message).toEqual('id must be unique');
      done();
    });
  });
});
