const Incident = require("../models").Incidents;
const User = require("../models").Users;
const Note = require("../models").Notes;
const Chat = require("../models").Chats;
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
        res.status(201).send({ data: incident, status: "success" });
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
        res.status(200).send({ data: { incidents: incident }, status: "success" });
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
          return res.status(404).send({
            message: 'Incident not found', status: "fail"
          });
        }
        res.status(200).send({ data: incident, status: "success" });
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
          return res.status(404).send({
            message: 'Incident Not Found', status: "fail"
          });
        }
        return incident
          .update({
            description: req.body.description || incident.description,
            dateOccurred: req.body.dateOccurred || incident.dateOccurred,
            statusId: req.body.statusId || incident.statusId,
            locationId: req.body.locationId || incident.locationId,
            categoryId: req.body.categoryId || incident.categoryId,
            witnesses: req.body.witnesses || incident.witnesses
          })
          .then(() => res.status(200).send({ data: incident, status: "success" }))
          .catch(error => res.status(400).send(error));
      });
  },

  // delete an incident by ID. To be refactored into archive incidents that are old and resolved.
  delete(req, res) {
    return Incident
      .findById(req.params.id)
      .then(incident => {
        if (!incident) {
          return res.status(404).send({
            message: 'Incident not found', status: "fail"
          });
        }
        return incident
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      });
  },
}
