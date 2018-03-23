const locationService = require('../services/locations');
const Location = require('../models').Locations;
const Incident = require('../models').Incidents;

module.exports = {
  // add a location
  create(req, res) {
    let name = req.body.name,
      centre = req.body.centre,
      country = req.body.country;
    return locationService.create(name, centre, country).then(location => {
      if (location === 'Resolved') {
        return res.status(200).send({ message: 'This location already exists' });
      }
      if (location === 'Reject') {
        return res.status(400).send({ message: 'Please enter (name, centre, country)' });
      }
      res.status(201).send({ data: location, status: 'success' });
    }).catch(error => {
      res.status(400).send(error);
    });
  },

  // view all locations
  list(req, res) {
    return Location
      .findAll()
      .then(location => {
        res.status(200).send({ data: { locations: location }, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // retrieve a location by ID
  findById(req, res) {
    return Location
      .findById(req.params.id)
      .then(location => {
        if (!location) {
          return res.status(404).send({
            message: 'Location not found', status: 'fail'
          });
        }
        res.status(200).send({ data: location, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // update a location
  update(req, res) {
    return Location
      .findById(req.params.id)
      .then(location => {
        if (!location) {
          return res.status(404).send({
            message: 'Location not found', status: 'fail'
          });
        }
        return location
          .update({
            name: req.body.name || location.name,
            centre: req.body.centre || location.centre,
            country: req.body.country || location.country
          })
          .then(() => res.status(200).send({ data: location, status: 'success' }))
          .catch(error => res.status(400).send(error));
      });
  },
  // filter incidents by location
  listIncidents(req, res) {
    return Incident
      .findAll({
        where: {
          locationId: req.params.id
        },
      })
      .then(incident => {
        res.status(200).send({ data: { incidents: incident }, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },
};
