const Incident = require("../models").Incidents;
const User = require("../models").Users;
const Location = require("../models").Locations;
const Category = require("../models").Categories;
const Status = require("../models").Statuses;

module.exports = {
  //create an incident
  create(req, res) {
    return Incident
      .create({
        description: req.body.description,
        dateOccurred: req.body.dateOccurred,
        userId: req.body.userId,
        statusId: req.body.statusId,
        locationId: req.body.locationId,
        categoryId: req.body.categoryId,
        witnesses: req.body.witnesses
      })
        .then(incident => {
          res.status(201).send(incident);
        })
          .catch(error => {
            res.status(400).send(error);
          });
        },

  // get all incidents
  list(req, res) {
    return Incident
    .findAll()
    .then(incident => {
      res.status(200).send(incident);
    })
    .catch(error => {
      res.status(400).send(error)
    });
  },

  // retrieve an incident by ID
  findById(req, res) {
    return Incident
      .findById(req.params.id)
      .then(incident => {
        if (!incident) {
          res.status(404).send({
            message: 'Incident not found'
          });
        }
        res.status(200).send(incident);
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

// update an incident
update(req, res) {
  return Incident
    .findById(req.params.id)
    .then(incident => {
      if (!incident) {
        res.status(404).send({
          message: 'Incident Not Found'
        });
      }
      return incident
        .update({
          description: req.body.description || incident.description,
          dateOccurred: req.body.dateOccurred || incident.description,
          statusId: req.body.statusId || incident.statusId,
          locationId: req.body.locationId || incident.locationId,
          categoryId: req.body.categoryId || incident.categoryId,
          witnesses: req.body.witnesses || incident.witnesses
        })
        .then(() => res.status(200).send(incident))
        .catch(error => res.status(400).send(error));
    });
  },

// delete an incident by ID
delete(req, res) {
  return Incident
    .findById(req.params.id)
    .then(incident => {
      if (!incident) {
        res.status(404).send({
          message: 'Incident not found'
        });
      }
      return incident
      .destroy()
      .then(() => res.status(204).send())
      .catch(error => res.status(400).send(error));
    });
  },
}
