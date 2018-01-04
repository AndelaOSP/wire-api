const Status = require("../models").Statuses;

module.exports = {
  //add a status, incase admin needs an additional one
  create(req, res) {
    const { status } = req.body;
    return Status
    .findOne({ where: { status } })
      .then((stati) => {
        if (stati) {
          return res.status(400).send({
            message: `The status '${status}' already exists`, status: "fail"
          });
        }
        if (!status) {
          return res.status(400).send({
            message: "Please enter the status name", status: "fail"
          });
        }
        Status.create({
        status: req.body.status
      })
      .then (status => {
        return res.status(201).send({ data:status, status: "success" })
      });
    })
    .catch(error => {
      res.status(400).send(error);
    });
  },

  // view all statuses
  list(req, res) {
    return Status
    .findAll()
    .then(status => {
      res.status(200).send({ data: { statuses: status }, status: "success" });
    })
    .catch(error => {
      res.status(400).send(error)
    });
  },

  // retrieve a status by ID
  findById(req, res) {
    return Status
      .findById(req.params.id)
      .then(status => {
        if (!status) {
          return res.status(404).send({
            message: 'status not found', status: "fail"
          });
        }
        res.status(200).send({ data:status, status: "success" });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

// update a status
update(req, res) {
  return Status
  .findById(req.params.id)
  .then(status => {
    if (!status) {
      return res.status(404).send({
        message: 'status not found', status: "fail"
      });
    }
    return status
    .update({
      status: req.body.status
    })
    .then(() => res.status(200).send({ data: status, status: "success"})
  )
  })
  .catch(error => {
    res.status(400).send(error);
  });
}
}