const Note = require('../models').Notes;
const User = require('../models').Users;

module.exports = {
  // add a Note
  create(req, res) {
    const { note } = req.body;
    return Note.findOne({ where: { note } })
      .then(note => {
        Note.create({
          note: req.body.note,
          userEmail: req.body.userEmail,
          incidentId: req.params.id
        }).then(note => {
          return res.status(201).send({ data: note, status: 'success' });
        });
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
      }
    })
      .then(note => {
        return res.status(200).send({ data: { notes: note }, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // retrieve a Note by ID
  findById(req, res) {
    return Note.findById(req.params.id)
      .then(Note => {
        if (!Note) {
          return res.status(404).send({
            message: 'Note not found',
            status: 'fail'
          });
        }
        return res.status(200).send({ data: Note, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // update a Note
  update(req, res) {
    return Note.findById(req.params.id)
      .then(Note => {
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
          .then(() => {
            return res.status(200).send({ data: Note, status: 'success' });
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
