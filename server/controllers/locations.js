const Location = require("../models").Locations;

module.exports = {
  //add a location
  create(req, res) {
    const { name } = req.body;
    return Location
      .findOne({ where: { name } })
      .then((location) => {
        if (location) {
          return res.status(400).send({
            message: `The location ${name} already exists`, status: "fail"
          });
        }
        if (!name) {
          return res.status(400).send({
            message: "Please enter the location name", status: "fail"
          });
        }
        Location.create({
        name: req.body.name
      })
      .then (location => {
        return res.status(201).send({ data:location, status: "success" })
      });
    })
    .catch(error => {
      res.status(400).send(error);
    });
  },

  // view all locations
  list(req, res) {
    return Location
    .findAll()
    .then(location => {
      res.status(200).send({ data: { locations: location }, status: "success" });
    })
    .catch(error => {
      res.status(400).send(error)
    });
  },

  // retrieve a location by ID
  findById(req, res) {
    return Location
      .findById(req.params.id)
      .then(location => {
        if (!location) {
          return res.status(404).send({
            message: 'Location not found', status: "fail"
          });
        }
        res.status(200).send({ data:location, status: "success" });
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
            message: 'Location not found', status: "fail"
          });
        }
        return location
          .update({
            name: req.body.name || location.name
          })
          .then(() => res.status(200).send({ data: location, status: "success" }))
          .catch(error => res.status(400).send(error));
      });
  }
}
