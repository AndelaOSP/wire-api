const slackEvent = require('../../models/index').slackEvents;
const {slackUserRequest} = require('../../middlewares/index');

const createSlackEvents = payload => ({
  id: payload.event_id,
  type: payload.event.type,
  event_ts: payload.event.event_ts,
  user: payload.event.user,
  ts: payload.event.ts,
  text: payload.event.text,
  channel: payload.event.channel,
  channel_type: payload.event.channel_type,
});

const urlVerification = req => ({
  token: req.body.token,
  challenge: req.body.challenge,
  type: req.body.type,
});

module.exports = {
  // add a slack event
  createSlackEvent: (req, res) => {
    if (req.body.challenge) {
      const data = urlVerification(req);
      return res.status(201).send({data, status: 'success'});
    }
    // Get event payload
    let payload = req.body;

    slackEvent.create(createSlackEvents(payload))
      .then(() => {
        slackUserRequest.getSlackUsers(payload.event.user, payload.event_id);
        slackUserRequest.getSlackChannel(payload.event.channel, payload.event_id);

        // slack response should be returned within 3 seconds
        res.status(201).send({status: 'success'});
      })
      .catch(err => {
        res.status(400).send({
          status: 'failure',
          message: err.errors[0].message
        });
      });
  },
};
