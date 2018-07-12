const errorLogs = require('./errorLogs');
const Chat = require('../models').Chats;
const User = require('../models').Users;

let userAttributes = {
  model: User,
  attributes: ['id', 'imageUrl', 'username']
};

const findChatById = (id, res) => {
  return Chat.findById(id, { include: userAttributes })
    .then(chat => {
      return chat;
    })
    .catch(error => {
      throw(error);
    });
};

module.exports = {
  // add a chat
  create(req, res) {
    return Chat.create({
      chat: req.body.chat,
      userEmail: req.body.userEmail,
      incidentId: req.params.id
    })
      .then(chat => {
        return findChatById(chat.id, res);
      })
      .then(data => {
        return res.status(201).send({ data, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        res.status(400).send(error);
      });
  },

  // view all chats of an incident
  list(req, res) {
    return Chat.findAll({
      where: {
        incidentId: req.params.id
      },
      include: userAttributes
    })
      .then(chat => {
        return res
          .status(200)
          .send({ data: { chats: chat }, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        res.status(400).send(error);
      });
  },

  // retrieve a chat by id
  findById(req, res) {
    return findChatById(req.params.id, res)
      .then(chat => {
        if (!chat) {
          return res.status(404)
            .send({ message: 'Chat not found', status: 'fail' });
        }
        return res.status(200).send({ data: chat, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        return res.status(400).send(error);
      });
  },

  // update a chat
  update(req, res) {
    return Chat.findById(req.params.id).then(Chat => {
      if (!Chat) {
        return res.status(404).send({
          message: 'Chat not found',
          status: 'fail'
        });
      }
      return Chat.update({
        chat: req.body.chat || Chat.chat,
        incidentId: req.body.incidentId || Chat.incidentId,
        userEmail: req.body.userEmail || Chat.userEmail
      })
        .then(Chat => {
          return findChatById(Chat.id, res);
        })
        .then(data => {
          return res.status(200).send({ data, status: 'success' });
        })
        .catch(error => {
          errorLogs.catchErrors(error);
          res.status(400).send(error);
        });
    });
  },

  // delete a chat
  delete(req, res) {
    return Chat.findById(req.params.id).then(Chat => {
      if (!Chat) {
        return res.status(404).send({
          message: 'Chat not found',
          status: 'fail'
        });
      }
      return Chat.destroy()
        .then(() => {
          return res.status(204).send();
        })
        .catch(error => {
          errorLogs.catchErrors(error);
          res.status(400).send(error);
        });
    });
  }
};
