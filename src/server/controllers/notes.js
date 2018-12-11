const Note = require('../models').Notes;
const User = require('../models').Users;
const deleteFromResponseLocals = require('../helpers/deleteFromResponseLocals')

let userAttributes = {
  model: User,
  attributes: ['id', 'imageUrl', 'username'],
};

const findNoteById = async id => {
  const note = await Note.findById(id, { include: userAttributes });

  return note;
};

module.exports = {
  // add a note
  create: async (req, res) => {
    const note = await Note.create({
      note: req.body.note,
      userEmail: req.body.userEmail,
      incidentId: req.params.id,
    });

    const data = await findNoteById(note.id, res);

    return res.status(201).send({ data, status: 'success' });
  },

  // view all notes of an incident
  list: async (req, res) => {
    const notes = await Note.findAll({
      where: {
        incidentId: req.params.id,
      },
      include: userAttributes,
    });

    return res.status(200).send({ data: { notes }, status: 'success' });
  },

  // retrieve a note by id
  findById: (req, res) => {
    return res.status(200).send({ data: res.locals.note, status: 'success' });
  },

  // update a note
  update: async (req, res) => {
    const note = await res.locals.note.update({
      note: req.body.note || Note.note,
      userEmail: req.body.userEmail || Note.userEmail,
    });

    const data = await findNoteById(note.id, res);

    return res.status(200).send({ data, status: 'success' });
  },

  // delete a note
  delete: (req, res) => {
    deleteFromResponseLocals(req, res, 'note');
  },
};
