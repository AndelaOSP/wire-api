const Location = require("../models").Locations;

module.exports = {
  // add a location
  create(name, centre, country, req, res) {
    return Location
      .findOne({ where: { name, centre, country } })
      .then(location => {
        if (location) {
          return Promise.resolve("Resolved");
        }
        if ((name == null) || (centre == null) || (country == null)) {
          return Promise.resolve("Reject")
        }
        return Location.create({ name, centre, country });
      }).then(location => {
        return Promise.resolve(location);
      })
      .catch(error => {
        throw(error);
      });
  },
}
