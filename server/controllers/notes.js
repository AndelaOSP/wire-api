const Note = require("../models").Notes;

module.exports = {
  // add a Note
  create(req, res) {
    return Note
      .create({
          note: req.body.note,
          userId: req.body.userId,
          incidentId: req.params.id
      })
      .then(note => {
          res.status(201).send({ data: note, status: "success" });
      })
      .catch(error => {
          res.status(400).send(error);
      });
    },
  
    // view all Notes of an Incident
  list(req, res) {
    return Note
      .findAll({
        where: {
          incidentId: req.params.id
        },
      })
      .then(note=> {
      res.status(200).send({ data: { notes: note }, status: "success" });
      })
      .catch(error => {
      res.status(400).send(error)
      });
  },

  // retrieve a Note by ID
  findById(req, res) {
    return Note
      .findById(req.params.id)
      .then(Note => {
        if (!Note) {
          return res.status(404).send({
            message: 'Note not found', status: "fail"
          });
        }
        res.status(200).send({ data:Note, status: "success" });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // update a Note
  update(req, res) {
    return Note
        .findById(req.params.id)
        .then(Note => {
            if (!Note) {
            return res.status(404).send({
                message: 'Note not found', status: "fail"
            });
            }
        return Note
            .update({
              note: req.body.note || Note.note,
              userId: req.body.userId || Note.userId
            })
            .then(() => res.status(200).send({ data: Note, status: "success" }))
            .catch(error => res.status(400).send(error));
      });
  },

  // delete a Note
  delete(req, res) {
    return Note
        .findById(req.params.id)
        .then(Note => {
          if (!Note) {
            return res.status(404).send({
                message: 'Note not found', status: 'fail'
            });
          }
          return Note
            .destroy()
            .then(() => res.status(204).send({ message: 'Note deleted successfully.' }))
        })
  }

}