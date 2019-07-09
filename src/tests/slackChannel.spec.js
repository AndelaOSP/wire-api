const { sendRequest } = require('./helpers/request');

const testPayload = {
	incidentId: "1",
	channelId: "1",
	channelName: "Channel name",
	channelMembers: "6678"
}

const testPayloadBad = {
	channelId: "1",
	channelName: "Channel name",
	channelMembers: "6678"
}

describe('Slack channel api test', () => {
  it('should save incident slack channel relationship', done => {
    sendRequest('post', '/api/slack/channel', testPayload, (err, res) => {
      expect(res.body.status).toEqual('success');
      done();
    });
  });

  it('should return an error when data is not provided', done => {
    sendRequest('post', '/api/slack/channel', testPayloadBad, (err, res) => {
      expect(res.body.status).toEqual('failure');
      done();
    });
  });
})
