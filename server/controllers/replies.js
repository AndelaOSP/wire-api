const Reply = require("../models").Replies;

module.exports = {
  // add a Reply
  create(req, res) {
    const { reply } = req.body
    return Reply
      .findOne({ where: { reply } })
      .then(reply => {
        if (!reply) {
          return res.status(400).send({
            message: "Please enter a valid reply", status: "fail"
          });
        }
        Reply.create({
          reply: req.body.reply,
          userId: req.body.userId,
          noteId: req.params.id
        })
        .then(reply => {
          res.status(201).send({ data: reply, status: "success" });
        });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },
  // view all Replies of a Note
  list(req, res) {
    return Reply
      .findAll({
        where: {
          noteId: req.params.id
        },
      })
      .then(reply => {
        res.status(200).send({ data: { replies: reply }, status: "success" });
      })
      .catch(error => {
        res.status(400).send(error)
      });
  },
  // retrieve a Reply by ID
  findById(req, res) {
    return Reply
      .findById(req.params.id)
      .then(Reply => {
        if (!Reply) {
          return res.status(404).send({
            message: 'Reply not found', status: "fail"
          });
        }
        res.status(200).send({ data: Reply, status: "success" });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },
  // update a Reply
  update(req, res) {
    return Reply
      .findById(req.params.id)
      .then(Reply => {
        if (!Reply) {
          return res.status(404).send({
            message: 'Reply not found', status: "fail"
          });
        }
        return Reply
          .update({
            reply: req.body.reply || Reply.reply,
            noteId: req.body.noteId || Reply.noteId,
            userId: req.body.userId || Reply.userId
          })
          .then(() => res.status(200).send({ data: Reply, status: "success" }))
          .catch(error => res.status(400).send(error));
      });
  },
  // delete a Reply
  delete(req, res) {
    return Reply
      .findById(req.params.id)
      .then(Reply => {
        if (!Reply) {
          return res.status(404).send({
            message: 'Reply not found', status: 'fail'
          });
        }
        return Reply
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      })
  }
}
