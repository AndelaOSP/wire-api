const Location = require('../models').Locations;

module.exports = {
  // add a location
  create: async (req, res) => {
    let { name, centre, country } = req.body;

    if (!name || !centre || !country) {
      return res.status(400).send({
        message: 'Location name, centre or country missing',
      });
    }

    const [location, created] = await Location.findOrCreate({
      where: req.body,
    });

    if (created) return res.status(201).send(location);

    return res.status(409).send('Location already exists');
  },

  // view all locations
  list: async (req, res) => {
    const locations = await Location.findAll();

    return res.status(200).send({
      data: { locations },
      status: 'success',
    });
  },
};
