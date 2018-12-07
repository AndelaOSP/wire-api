const Location = require('../models').Locations;

const findOrCreateLocation = async (location, res) => {
  let { name, centre, country } = location;

  if (!name || !centre || !country) {
    return res.status(400).send({
      status: 'fail',
      message: 'Provide the location name, centre and country',
    });
  }

  const [returnedLocation] = await Location.findOrCreate({
    where: {
      name,
      centre,
      country,
    },
  });

  return returnedLocation;
};

module.exports = {
  findOrCreateLocation,
};
