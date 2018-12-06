const Location = require('../models').Locations;

const findOrCreateLocation = (location, res) => {
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
  }).spread((location, created) => {
    return location;
  });
};

module.exports = {
  findOrCreateLocation,
};
