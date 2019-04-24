const slackEvent = require('../../models/index').slackEvents;
const slackUser = require('../../models/index').slackUsers;
const {slackUserRequest} = require('../../middlewares/index');

const createSlackEvents = payload => ({
  id: payload.event_id,
  type: payload.event.type,
  eventTs: payload.event.event_ts,
  slackUserId: payload.event.user,
  ts: payload.event.ts,
  text: payload.event.text,
  channelId: payload.event.channel,
  channelType: payload.event.channel_type,
});

const urlVerification = req => ({
  token: req.body.token,
  challenge: req.body.challenge,
  type: req.body.type,
});

module.exports = {
  // add a slack event
  createSlackEvent: async (req, res) => {
    if (req.body.challenge) {
      const data = urlVerification(req);
      return res.status(201).send({data, status: 'success'});
    }
    // Get event payload
    let payload = req.body;

    await slackUserRequest.getSlackUsers(payload.event.user);

    slackEvent.create(createSlackEvents(payload))
      .then(() => {
        slackUserRequest.getSlackChannel(payload.event.channel, payload.event.user);

        // slack response should be returned within 3 seconds
        res.status(201).send({status: 'success'});
      })
      .catch(err => {
        res.status(400).send({
          status: 'failure',
          message: err.errors ? err.errors[0].message : err.message
        });
      });
  },

  // get slack chats
  getSlackChats: async (req, res) => {
    const chats = await slackEvent.findAll({
      include: [{
        model: slackUser,
        as: 'slackUser',
      }],
    });

    return res.status(200).send({data: { chats }, status: 'success'});

  },
};
