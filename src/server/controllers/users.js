const errorLogs = require('./errorLogs');
const User = require('../models').Users;
const Incident = require('../models').Incidents;
const Role = require('../models').Roles;
const Location = require('../models').Locations;
const LocationService = require('./locations');
const emailHelper = require('../helpers/emailHelper');
const generateEmailBody = require('../helpers/generateEmailBody');
const { token } = require('../middlewares/authentication');
const getUsernameFromEmail = require('../helpers/getUsernameFromEmail');
const Sequelize = require('sequelize');
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

  // login a user
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

  // GET admins/super admins
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
  getUserById(req, res, next) {
    if (req.params.userId === 'search') return next('route');
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
  },
  inviteUser(req, res) {
    const name = getUsernameFromEmail(req.body.email);
    res.locals.username = name.first + ' ' + name.last;
    const userObject = {
      email: req.body.email,
      username: res.locals.username,
      roleId: req.body.roleId,
      locationId: req.body.locationId
    };
    return User.findOrCreate({where: { email: userObject.email},
      defaults: userObject})
      .spread( async (createdUser, created) => {
        if(!created) {
          await User.update(req.body,{
            where: {
              email: userObject.email
            },
            returning: true
          });
          return res.status(200).send({ message: 'the user role has been updated' });
        }
        const emailBody = await generateEmailBody(req.body.email, req.body.roleId);
        const callback = (error) => {
          if (error) {
            return error;
          }
          return {message: 'The email was sent successfully'};
        };
        emailHelper.sendMail(emailBody, callback);
        const user = await User.findById(createdUser.id, { include: includes});
        return res.status(200).send({ data: user, status: 'success' });
      })
      .catch(error => {
        errorLogs.catchErrors(error);
        res.status(400).send(error);
      });
  },

  /**
 * @function editUser
 * @param Object req
 * @param Object res
 * @return Status Code & Object
 */
  async editUser(req, res) {
    try {
      const [_,[updatedUser]] = await User.update(req.body,{
        where: {
          id: req.params.userId
        },
        returning: true
      });
      const user = await User.findById(updatedUser.id, {include: includes});
      return res.status(200).send({ data: user, status: 'success' });
    } catch (error) {
      errorLogs.catchErrors(error);
      res.status(400).send(error); 
    }
  },

  /**
 * @function deleteUser
 * @param Object req
 * @param Object res
 * @return Status Code & Object
 */
  async deleteUser(req, res) {
    try {
      await User.destroy({
        where: {
          id: req.params.userId
        },
      });
      const message = 'User deleted Successfully';
      return res.status(200).send({message});
    } catch (error) {
      errorLogs.catchErrors(error);
      res.status(400).send(error); 
    }
  },

  /**
 * @function searchUser
 * @param Object req
 * @param Object res
 * @return Status Code & Object with array of users
 */
  async searchUser(req, res) {
    try {
      const searchQuery = { $ilike: Sequelize.fn('lower', `%${req.query.q.toLowerCase()}%`)};
      const users = await User.findAll({
        where: { $or: {'username': searchQuery, 'email': searchQuery}},
        include: includes
      });
      return res.status(200).send({data: {users}, status: 'success'});
    } catch (error) {
      errorLogs.catchErrors(error);
      res.status(400).send(error); 
    }
  }
};
