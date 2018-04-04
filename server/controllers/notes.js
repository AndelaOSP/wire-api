const Note = require('../models').Notes;
const User = require('../models').Users;

let userAttributes = {
  model: User,
  attributes: ['id', 'imageUrl', 'username']
};

const findNoteById = (id, res) => {
  return Note.findById(id, { include: userAttributes })
    .then(note => {
      if (!note) {
        return res.status(404)
          .send({ message: 'Note not found', status: 'fail' });
      }
      return note;
    })
    .catch(error => {
      res.status(400).send(error);
    });
};

module.exports = {
  // add a Note
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
        res.status(400).send(error);
      });
  },

  // view all Notes of an Incident
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
        res.status(400).send(error);
      });
  },

  // retrieve a Note by ID
  findById(req, res) {
    return findNoteById(req.params.id, res)
      .then(note => {
        return res.status(200).send({ data: note, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // update a Note
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
        .catch(error => res.status(400).send(error));
    });
  },

  // delete a Note
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
        .catch(error => res.status(400).send(error));
    });
  }
};
