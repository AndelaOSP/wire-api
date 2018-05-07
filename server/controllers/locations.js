const errorLogs = require('./errorLogs');
const Location = require('../models').Locations;
const Incident = require('../models').Incidents;

module.exports = {
  // add a location
  create(location, res) {
    let { name, centre, country } = location;
    if (!name || !centre || !country) {
      return res.status(400).send({
        status: 'fail',
        message: 'Provide the location name, centre and country'
      });
    }
    return Location.findOrCreate({
      where: {
        name,
        centre,
        country
      }
    })
      .spread((location, created) => {
        return location;
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        res.status(400).send(error);
      });
  },

  // view all locations
  list(req, res) {
    return Location.findAll()
      .then(location => {
        return res
          .status(200)
          .send({ data: { locations: location }, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        res.status(400).send(error);
      });
  }
};
