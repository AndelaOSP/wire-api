const db = require('../models/');
const Incident = db.Incidents;
const User = db.Users;
const Location = db.Locations;
const Category = db.Categories;
const Status = db.Statuses;

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
        else res.status(200).send(incident);
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },  
}
