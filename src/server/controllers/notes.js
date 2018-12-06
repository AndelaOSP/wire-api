const errorLogs = require('./errorLogs');
const Note = require('../models').Notes;
const User = require('../models').Users;

let userAttributes = {
  model: User,
  attributes: ['id', 'imageUrl', 'username'],
};

const findNoteById = (id, res) => {
  return Note.findById(id, { include: userAttributes }).then(note => {
    return note;
  });
};

module.exports = {
  // add a note
  create(req, res) {
    return Note.create({
      note: req.body.note,
      userEmail: req.body.userEmail,
      incidentId: req.params.id,
    })
      .then(note => {
        return findNoteById(note.id, res);
      })
      .then(data => {
        return res.status(201).send({ data, status: 'success' });
      });
  },

  // view all notes of an incident
  list(req, res) {
    return Note.findAll({
      where: {
        incidentId: req.params.id,
      },
      include: userAttributes,
    }).then(notes => {
      return res.status(200).send({ data: { notes }, status: 'success' });
    });
  },

  // retrieve a note by id
  findById(req, res) {
    return res.status(200).send({ data: res.locals.note, status: 'success' });
  },

  // update a note
  update(req, res) {
    return res.locals.note
      .update({
        note: req.body.note || Note.note,
        userEmail: req.body.userEmail || Note.userEmail,
      })
      .then(Note => {
        return findNoteById(Note.id, res);
      })
      .then(data => {
        return res.status(200).send({ data, status: 'success' });
      });
  },

  // delete a note
  delete(req, res) {
    return res.locals.note.destroy().then(() => {
      return res.status(204).send();
    });
  },
};
