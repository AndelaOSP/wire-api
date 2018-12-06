const Location = require('../models').Locations;
const Incident = require('../models').Incidents;
const errorLogs = require('../controllers/errorLogs');

module.exports = {
  // add a location
  create(req, res) {
    let { name, centre, country } = req.body;

    if (!name || !centre || !country) {
      return res.status(400).send({
        message: 'Location name, centre or country missing'
      });
    }

    return Location.findOrCreate({ where: req.body })
      .then(([location, created]) => {
        if (created) return res.status(201).send(location);
        return res.status(409).send('Location already exists');
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
