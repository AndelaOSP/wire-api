const Location = require("../models").Locations;

module.exports = {
  // add a location
  create(name, centre, country, req, res) {
    if (!name || !centre || !country) {
      return Promise.reject("Provide the location name, centre and country");
    } else {
      return Location.findOne({ where: { name, centre, country } })
      .then(location => {
        return location ? Promise.resolve(location) : Location.create({ name, centre, country });
      }).then(location => {
        return location;
      })
      .catch(error => {
        throw(error);
      });
    }
  },
}
