const Sequelize = require('sequelize');
const User = require('../models').Users;
const Incident = require('../models').Incidents;
const { findOrCreateLocation } = require('../helpers/locationHelper');
const { token } = require('../middlewares/authentication');
const {
  getUserByEmail,
  include,
  updateExistingUser,
  createAndInviteUser,
} = require('../helpers/userHelper');
const { verifyEmail } = require('../helpers/emailHelper');

require('dotenv').config();

module.exports = {
  // add a user
  create: async (req, res) => {
    let { email, username, imageUrl, location, userId: id } = req.body;
    let roleId = 2;
    const foundLocation = await findOrCreateLocation(location, res);

    const [user] = await User.findOrCreate({
      where: {
        id,
        email,
        username,
        imageUrl,
        roleId,
        locationId: foundLocation.id,
      },
    });

    return res.status(201).send({ data: user, status: 'success' });
  },

  // login a user
  login: async (req, res) => {
    if (!req.body.email) {
      return res.status(400).send({ message: 'Email missing', status: 'fail' });
    }

    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(404).send({ message: 'User does not exist' });
    }

    if (user.roleId === 1) {
      return res.status(403).send({ message: 'You are not authorized' });
    }

    const userToken = token(user);

    return res.status(200).send({
      message: 'You were successfully logged in',
      user,
      userToken,
      expiresIn: '24h',
    });
  },

  list: async (req, res) => {
    const users = await User.findAll({ include });

    return res.status(200).send({ data: { users }, status: 'success' });
  },

  getUserById: async (req, res, next) => {
    const user = await User.findById(req.params.id, {
      include: [
        ...include,
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
    });
    return res.status(200).send(user);
  },

  inviteUser: async (req, res) => {
    const { email } = req.body;
    const validEmail = await verifyEmail(email);
    if (!validEmail) {
      return res.status(404).send({ message: 'That email does not exist' });
    }
    const userExists = await getUserByEmail(req.body.email);
    if (userExists && userExists.Role) {
      // If user was created through reporting an incident, update the user with provided role
      return updateExistingUser(req, res, userExists);
    }
    return createAndInviteUser(req, res, userExists);
  },

  /**
   * @function editUser
   * @param Object req
   * @param Object res
   * @return Status Code & Object
   */

  editUser: async (req, res) => {
    const updatedUser = await res.locals.user.update(req.body);

    const user = await User.findById(updatedUser.id, { include: include });

    return res.status(200).send({ data: user, status: 'success' });
  },

  /**
   * @function deleteUser
   * @param {Object} req
   * @param {Object} res
   * @return Status Code & Object
   */
  deleteUser: async (req, res) => {
    await res.locals.user.destroy();
    const message = 'User deleted Successfully';
    return res.status(200).send({ message });
  },

  /**
   * @function searchUser
   * @param {Object} req
   * @param {Object} res
   * @return Status Code & Object with array of users
   */

  async searchUser(req, res) {
    if (!req.query.q) return res.status(400).send({ message: 'query missing' });

    const searchQuery = {
      $ilike: Sequelize.fn('lower', `%${req.query.q.toLowerCase()}%`),
    };

    const users = await User.findAll({
      where: { $or: { username: searchQuery, email: searchQuery } },
      include: include,
    });

    return res.status(200).send({ data: { users }, status: 'success' });
  },
};
