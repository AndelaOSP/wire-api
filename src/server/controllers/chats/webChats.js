const models = require('../../models/index');
const { postChat } = require('../../middlewares/index');

require('dotenv').config();

const message = {
  message: 'there was an error posting your message to slack, try again',
  status: 'failure',
};

module.exports = {
  // eslint-disable-next-line max-lines-per-function
  createAppChat: async (req, res) => {
    if (req.body.text.length === 0) {
      return res
        .status(400)
        .send({ message: 'Text is required', status: 'failure' });
    }
    let channelID;
    const { incidentId } = req.body;
    try {
      const SlackChannel = await models.SlackChannels.findAll({
        attributes: ['channelId'],
        where: { incidentId: incidentId },
      });
      const { channelId } = SlackChannel[0];
      channelID = channelId;
    } catch (err) {
      return res
        .status(400)
        .send({ message: 'incident not found', status: 'failure' });
    }
    try {
      const chat = await models.SlackWireEvents.create({
        text: req.body.text,
        type: 'web_message',
        userId: res.locals.currentUser.id,
        channelId: channelID,
      });
      // post chat to specific slack channel
      postChat
        .postChat(chat.text, channelID)
        .then(response => {
          if (response.ok) {
            return res.status(201).send({ chat, status: 'success' });
          }
          return res.status(400).send(message);
        })
        .catch(() => {
          return res.status(400).send(message);
        });
    } catch (err) {
      res.status(500).send({
        message:
          'sorry an error occured. We could not complete your action, try again',
        status: 'failure',
      });
    }
  },
};
