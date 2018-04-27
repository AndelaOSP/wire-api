const errorLogs = require('./errorLogs');
const User = require('../models').Users;
const Incident = require('../models').Incidents;
const Role = require('../models').Roles;
const Location = require('../models').Locations;
const LocationService = require('./locations');


let includes = [{
  model: Role,
  attributes: ['name']
},
{
  model: Location,
  attributes: ['name', 'centre', 'country']
}];

module.exports = {
  // add a user
  create(req, res) {
    let id = req.body.userId;
    let email = req.body.email;
    let username = req.body.username;
    let imageUrl = req.body.imageUrl;
    let roleId = 2;
    let location = req.body.location;
    return LocationService.create(location, res)
      .then(location => {
        return location.dataValues.id;
      })
      .then(locationId => {
        return User.findOrCreate({
          where: {
            id,
            email,
            username,
            imageUrl,
            roleId,
            locationId
          }
        });
      })
      .spread((user, created) => {
        return res.status(201).send({ data: user, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        res.status(400).send(error);
      });
  },
  // GET admins/super admins
  list(req, res) {
    return User.findAll({
      include: includes
    })
      .then(user => {
        return res.status(200).send({ data: { users: user }, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        res.status(400).send(error);
      });
  },
  getUserById(req, res) {
    return User.findById(req.params.userId, {
      include: [
        includes,
        {
          model: Incident,
          as: 'reportedIncidents',
          through: {
            attributes: []
          }
        },
        {
          model: Incident,
          as: 'assignedIncidents',
          through: {
            attributes: []
          }
        },
        {
          model: Incident,
          as: 'incidentWitnesses',
          through: {
            attributes: []
          }
        },
      ]
    })
      .then(user => {
        return res.status(200).send(user);
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        res.status(400).send(error);
      });
  }
};
