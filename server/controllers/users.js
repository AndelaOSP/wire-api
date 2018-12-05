const Sequelize = require('sequelize');
const errorLogs = require('./errorLogs');
const User = require('../models').Users;
const Incident = require('../models').Incidents;
const Role = require('../models').Roles;
const Location = require('../models').Locations;
const { findOrCreateLocation } = require('../helpers/locationHelper');
const emailHelper = require('../helpers/emailHelper');
const generateEmailBody = require('../helpers/generateEmailBody');
const { token } = require('../middlewares/authentication');
const getUsernameFromEmail = require('../helpers/getUsernameFromEmail');
const checkEmail = require('../helpers/checkEmail');
const updateUserAndSendMail = require('../helpers/updateUserAndSendMail');

require('dotenv').config();

const includeRole = {
  model: Role,
  attributes: ['name', 'id'],
};

let includes = [
  includeRole,
  {
    model: Location,
    attributes: ['name', 'centre', 'country'],
  },
];

module.exports = {
  // add a user
  create(req, res) {
    let id = req.body.userId;
    let { email } = req.body;
    let { username } = req.body;
    let { imageUrl } = req.body;
    let roleId = 2;
    let { location } = req.body;
    return findOrCreateLocation(location, res)
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
            locationId,
          },
        });
      })
      .spread((user, created) => {
        return res.status(201).send({ data: user, status: 'success' });
      });
  },

  // login a user
  login(req, res) {
    if (!req.body.email) {
      return res.status(400).send({ message: 'Email missing', status: 'fail' });
    }
    return User.findOne({ where: { email: req.body.email } }).then(user => {
      if (!user) {
        return res.status(401).send({ message: 'User does not exist' });
      }
      if (user.roleId === 1) {
        return res.status(403).send({ message: 'You are not aunthorized' });
      }
      const userToken = token(user);
      return res.status(200).send({
        message: 'You were successfully logged in',
        user,
        userToken,
        expiresIn: '24h',
      });
    });
  },

  // GET admins/super admins
  list(req, res) {
    return User.findAll({
      include: includes,
    }).then(user => {
      return res.status(200).send({ data: { users: user }, status: 'success' });
    });
  },
  getUserById(req, res, next) {
    if (req.params.id === 'search') return next('route');
    return User.findById(req.params.id, {
      include: [
        ...includes,
        {
          model: Incident,
          as: 'reportedIncidents',
          through: {
            attributes: [],
          },
        },
        {
          model: Incident,
          as: 'assignedIncidents',
          through: {
            attributes: [],
          },
        },
        {
          model: Incident,
          as: 'incidentWitnesses',
          through: {
            attributes: [],
          },
        },
      ],
    }).then(user => {
      return res.status(200).send(user);
    });
  },
  async inviteUser(req, res) {
    const validEmail = checkEmail(req.body.email);
    const userExists = await User.findOne({
      where: { email: req.body.email },
      include: includeRole,
    });
    const callback = error => {
      if (error) {
        return error;
      }
      return { message: 'The email was sent successfully' };
    };
    const emailBody = await generateEmailBody(req.body.email, req.body.roleId);
    if (userExists && userExists.Role) {
      // If user was created through reporting an incident, update the user with provided role
      if (userExists.Role.id === 1) {
        try {
          await User.update(
            { roleId: req.body.roleId },
            { where: { email: req.body.email } },
          );
          const emailBody = await generateEmailBody(
            req.body.email,
            req.body.roleId,
          );
          emailHelper.sendMail(emailBody, callback);
          const user = await User.findOne({
            where: { email: req.body.email },
            include: includes,
          });
          return res.status(200).send({ data: user, status: 'success' });
        } catch (err) {
          res.status(400).send('An error occurred inviting the user');
        }
      } else {
        return res.status(400).json({
          message: `The user with that email address already exists as an ${
            userExists.Role.name
          } . Try updating their role`,
        });
      }
    } else {
      if (validEmail && !userExists) {
        const name = getUsernameFromEmail(req.body.email);
        res.locals.username = name.first + ' ' + name.last;
        const userObject = {
          email: req.body.email,
          username: res.locals.username,
          roleId: req.body.roleId,
          locationId: req.body.locationId,
        };
        return User.findOrCreate({
          where: { email: userObject.email },
          defaults: userObject,
        })
          .spread(async (createdUser, created) => {
            if (!created) {
              await updateUserAndSendMail(userObject, res);
            }
            emailHelper.sendMail(emailBody, callback);
            const user = await User.findById(createdUser.id, {
              include: includes,
            });
            return res.status(200).send({ data: user, status: 'success' });
          })
          .catch(error => {
            errorLogs.catchErrors(error);
            return res.status(400).send(error);
          });
      }
      res.status(400).json({
        message: 'You can only invite Andela users through their Andela emails',
      });
    }
  },

  /**
   * @function editUser
   * @param Object req
   * @param Object res
   * @return Status Code & Object
   */
  async editUser(req, res) {
    const updatedUser = await res.locals.user.update(req.body);
    const user = await User.findById(updatedUser.id, { include: includes });
    return res.status(200).send({ data: user, status: 'success' });
  },

  /**
   * @function deleteUser
   * @param Object req
   * @param Object res
   * @return Status Code & Object
   */
  async deleteUser(req, res) {
    await res.locals.user.destroy();
    const message = 'User deleted Successfully';
    return res.status(200).send({ message });
  },

  /**
   * @function searchUser
   * @param Object req
   * @param Object res
   * @return Status Code & Object with array of users
   */
  async searchUser(req, res) {
    const searchQuery = {
      $ilike: Sequelize.fn('lower', `%${req.query.q.toLowerCase()}%`),
    };
    const users = await User.findAll({
      where: { $or: { username: searchQuery, email: searchQuery } },
      include: includes,
    });
    return res.status(200).send({ data: { users }, status: 'success' });
  },
};
