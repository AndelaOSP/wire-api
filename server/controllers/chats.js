const Chat = require('../models').Chats;
const User = require('../models').Users;

let userAttributes = ['username', 'imageUrl', 'email'];

module.exports = {
  // add a Chat
  create(req, res) {
    const { chat } = req.body;
    return Chat.findOne({ where: { chat } })
      .then(chat => {
        Chat.create({
          chat: req.body.chat,
          userId: req.body.userId,
          incidentId: req.params.id
        }).then(chat => {
          res.status(201).send({ data: chat, status: 'success' });
        });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },
  // view all Chats of a Note
  list(req, res) {
    return Chat.findAll({
      include: {
        model: User,
        attributes: userAttributes
      },
      where: {
        incidentId: req.params.id
      }
    })
      .then(chat => {
        res.status(200).send({ data: { chats: chat }, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },
  // retrieve a Chat by ID
  findById(req, res) {
    return Chat.findById(req.params.id, {
      include: {
        model: User,
        attributes: userAttributes
      }
    })
      .then(Chat => {
        if (!Chat) {
          return res.status(404).send({
            message: 'Chat not found',
            status: 'fail'
          });
        }
        res.status(200).send({ data: Chat, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },
  // update a Chat
  update(req, res) {
    return Chat.findById(req.params.id, {
      include: {
        model: User,
        attributes: userAttributes
      }
    }).then(Chat => {
      if (!Chat) {
        return res.status(404).send({
          message: 'Chat not found',
          status: 'fail'
        });
      }
      return Chat.update({
        chat: req.body.chat || Chat.chat,
        incidentId: req.body.incidentId || Chat.incidentId,
        userId: req.body.userId || Chat.userId
      })
        .then(() => res.status(200).send({ data: Chat, status: 'success' }))
        .catch(error => res.status(400).send(error));
    });
  },
  // delete a Chat
  delete(req, res) {
    return Chat.findById(req.params.id).then(Chat => {
      if (!Chat) {
        return res.status(404).send({
          message: 'Chat not found',
          status: 'fail'
        });
      }
      return Chat.destroy()
        .then(() => res.status(204).send())
        .catch(error => res.status(400).send(error));
    });
  }
};
