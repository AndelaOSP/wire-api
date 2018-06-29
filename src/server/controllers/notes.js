const errorLogs = require('./errorLogs');
const Note = require('../models').Notes;
const User = require('../models').Users;

let userAttributes = {
  model: User,
  attributes: ['id', 'imageUrl', 'username']
};
/**
 * Represents a method to find a note by id.
 * @function
 * @param {string} id - Takes in the note id as a parameter
 * @returns a chat object.
 */
const findNoteById = id => {
  return Note.findById(id, { include: userAttributes })
    .then(note => {
      return note;
    })
    .catch(error => {
      throw error;
    });
};

/**
 * Represents a method create a note.
 * @function
 * @param {object} req - request body, ie note, userEmail,incidentId.
 * @param {object} res - response body  after succesfull or unsuccessfull note creation.
 * @returns a chat object.
 */
module.exports = {
  create(req, res) {
    return Note.create({
      note: req.body.note,
      userEmail: req.body.userEmail,
      incidentId: req.params.id
    })
      .then(note => {
        return findNoteById(note.id, res);
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
   * Represents a method to list all available notes on an incident.
   * @function
   * @param {object} req - request body, ie note, userEmail,incidentId.
   * @param {object} res - response body  after succesfull or unsuccessfull note creation.
   * @returns a note object.
   */
  list(req, res) {
    return Note.findAll({
      where: {
        incidentId: req.params.id
      },
      include: userAttributes
    })
      .then(note => {
        return res
          .status(200)
          .send({ data: { notes: note }, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        res.status(400).send(error);
      });
  },

  /**
   * Represents a method to retrieve a note by id.
   * @function
   * @param {object} req - request body, ie noteId.
   * @param {object} res - response body  after succesfull or unsuccessfull note retrieval.
   * @returns a note object.
   */
  findById(req, res) {
    return findNoteById(req.params.id, res)
      .then(note => {
        if (!note) {
          return res
            .status(404)
            .send({ message: 'Note not found', status: 'fail' });
        }
        return res.status(200).send({ data: note, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        return res.status(400).send(error);
      });
  },

  /**
   * Represents a method to update a note by id.
   * @function
   * @param {object} req - request body, ie noteId.
   * @param {object} res - response body  after succesfull or unsuccessfull note retrieval.
   * @returns a note object.
   */
  update(req, res) {
    return Note.findById(req.params.id).then(Note => {
      if (!Note) {
        return res.status(404).send({
          message: 'Note not found',
          status: 'fail'
        });
      }
      return Note.update({
        note: req.body.note || Note.note,
        userEmail: req.body.userEmail || Note.userEmail
      })
        .then(Note => {
          return findNoteById(Note.id, res);
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

  /**
   * Represents a method to delete a note by id.
   * @function
   * @param {object} req - request body, ie noteId.
   * @param {object} res - response body  after succesfull or unsuccessfull note deletion.
   * @returns a note object.
   */
  delete(req, res) {
    return Note.findById(req.params.id).then(Note => {
      if (!Note) {
        return res.status(404).send({
          message: 'Note not found',
          status: 'fail'
        });
      }
      return Note.destroy()
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
