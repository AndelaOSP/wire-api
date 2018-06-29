const errorLogs = require('./errorLogs');
const User = require('../models').Users;
const Incident = require('../models').Incidents;
const Role = require('../models').Roles;
const Location = require('../models').Locations;
const LocationService = require('./locations');
const { token } = require('../middlewares/authentication');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

let includes = [
  {
    model: Role,
    attributes: ['name']
  },
  {
    model: Location,
    attributes: ['name', 'centre', 'country']
  }
];
/**
 * Represents a method to create a user.
 * @module user
 * @function
 */

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

  /**
   * Represents a method to login in a user.
   * @function
   * @returns an response object with userToken,message,user
   */
  login(req, res) {
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (!user) {
          return res.status(401).send({ message: 'User does not exist' });
        }
        if (user.roleId === 1) {
          return res.status(403).send({ message: 'You are not aunthorized' });
        }
        const userToken = token(user.id, user.roleId);
        return res.status(200).send({
          message: 'You were successfully logged in',
          user,
          userToken,
          expiresIn: '24h'
        });
      })

      .catch(error => {
        res.status(401).send({ message: 'You are not authorised' });
      });
  },

  /**
   * Represents a method to list all available users in accordance to their role.
   * @function
   * @returns {object} returns an object with users.
   */
  list(req, res) {
    return User.findAll({
      include: includes
    })
      .then(user => {
        return res
          .status(200)
          .send({ data: { users: user }, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        res.status(400).send(error);
      });
  },

  /**
   * Represents a method to retrieve a user by id.
   * @function
   * @returns {object} returns a user object.
   */
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
        }
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
