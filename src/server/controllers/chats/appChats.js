const models = require('../../models/index');
const { postChat } = require('../../middlewares/index');

module.exports = {
  // add app chat
  createAppChat: async (req, res) => {

    if (req.body.text.length === 0) {
      return res.status(400).send({ message: 'Text is required', status: 'failure' });
    }

    const chat = await models.appChat.create({
      text: req.body.text,
    });

    postChat.postChat(chat.text);

    return res.status(201).send({ chat, status: 'success' });
  },
};
