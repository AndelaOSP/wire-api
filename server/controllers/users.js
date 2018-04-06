const User = require('../models').Users;
const Incident = require('../models').Incidents;
const Role = require('../models').Roles;


let role = {
  model: Role,
  attributes: ['name']
};

module.exports = {
  // add a user
  create(req, res) {
    let id = req.body.id;
    let email = req.body.email;
    let username = req.body.username;
    let imageUrl = req.body.imageUrl;
    let roleId = req.body.roleId;
    if (email) {
      return res
        .status(400)
        .send({ status: 'fail', message: 'User already exists' });
    }
    return User.findOrCreate({
      where: {
        id,
        email,
        username,
        imageUrl,
        roleId
      }
    })
      .spread((user, created) => {
        return res.status(201).send({ data: user, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },
  // GET admins/super admins
  list(req, res) {
    return User.findAll({
      include: role
    })
      .then(user => {
        return res.status(200).send({ data: { users: user }, status: 'success' });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  },
  getUserById(req, res) {
    return User.findById(req.params.userId, {
      include: [
        role,
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
      .catch(err => {
        res.status(400).send(err);
      });
  }
};
