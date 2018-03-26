const Location = require('../models').Locations;
const Incident = require('../models').Incidents;

module.exports = {
  // add a location
  create(location, res) {
    let { name, centre, country } = location;
    if (!name || !centre || !country) {
      return res.status(400).send({
        status: 'fail',
        message: 'Provide the location name, centre and country',
      });
    }
    return Location.findOrCreate({
      where: {
        name,
        centre,
        country,
      },
    })
      .spread((location, created) => {
        return location;
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // view all locations
  list(req, res) {
    return Location.findAll()
      .then(location => {
        return res.status(200).send({ data: { locations: location }, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // retrieve a location by ID
  findById(req, res) {
    return Location.findById(req.params.id)
      .then(location => {
        if (!location) {
          return res.status(404).send({
            message: 'Location not found',
            status: 'fail',
          });
        }
        return res.status(200).send({ data: location, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },

  // update a location
  update(req, res) {
    return Location.findById(req.params.id).then(location => {
      if (!location) {
        return res.status(404).send({
          message: 'Location not found',
          status: 'fail',
        });
      }
      return location
        .update({
          name: req.body.name || location.name,
          centre: req.body.centre || location.centre,
          country: req.body.country || location.country,
        })
        .then(() => {
          return res.status(200).send({ data: location, status: 'success' });
        })
        .catch(error => res.status(400).send(error));
    });
  },
  // filter incidents by location
  listIncidents(req, res) {
    return Incident.findAll({
      where: {
        locationId: req.params.id,
      },
    })
      .then(incident => {
        return res.status(200).send({ data: { incidents: incident }, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },
};
