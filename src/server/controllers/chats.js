const errorLogs = require('./errorLogs');
const Chat = require('../models').Chats;
const User = require('../models').Users;

let userAttributes = {
  model: User,
  attributes: ['id', 'imageUrl', 'username']
};

/**
 * Represents a method to find a chat by id.
 * @function
 * @param {string} id- The Id of the chat.
 */

const findChatById = id => {
  return Chat.findById(id, { include: userAttributes })
    .then(chat => {
      return chat;
    })
    .catch(error => {
      throw error;
    });
};

/**
 * Represents a method to create a chat.
 * @function
 * @param {Object} req- The request body, it takes in the chat, userEmail and incidentId.
 * @param {Object} res- The response body after a successfull of unsuccesful chat creation.
 * @returns {Object}
 */

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

  /**
   * Represents a method to list all available chats.
   * Takes in the incident Id as a parameter to the reqeust body
   * @function
   * @param {object} req - request body, ie incident id
   * @param {object} res - response body  after succesfull or unsuccessfull chats retrieval.
   */

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

  /**
   * Represents a method to find a chat by Id.
   * Takes in the incident Id as a parameter to the request body
   * @function
   * @param {string} req - chat Id
   * @param {string} res - response body
   */
  findById(req, res) {
    return findChatById(req.params.id, res)
      .then(chat => {
        if (!chat) {
          return res
            .status(404)
            .send({ message: 'Chat not found', status: 'fail' });
        }
        return res.status(200).send({ data: chat, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        return res.status(400).send(error);
      });
  },

  /**
   * Represents a method to update a chat by Id.
   * @function
   * @param {string} req- chat Id.
   * @param {object} res - response body.
   * @returns {object}
   */
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
          return res.status(200).send({
            data,
            status: 'success'
          });
        })
        .catch(error => {
          errorLogs.catchErrors(error);
          res.status(400).send(error);
        });
    });
  },

  /**
   * Represents a method to delete a note by id.
   * @function
   * @param {object} req - request body, ie ChatId.
   * @param {object} res - response body  after succesfull or unsuccessfull chat deletion.
   * @returns a note object.
   */
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
