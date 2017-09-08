const jwt = require('jsonwebtoken');
const Joi = require('joi');
const pick = require('lodash/pick');

function auth(req, reply) {
  // to be updated to use Google Auth
  const { email, password } = req.payload;
  // replace Knex with Sequelize
  const getOperation = Knex('user').where({
    email
  }).select('*').then(([user]) => {
    if (!user) {
      return reply({
        error: true,
        message: 'user not found',
      }).code(404);
    }

    // authenticate user user.password = ???
    if (user.password) {
      const token = jwt.sign(
        pick(user, 'name', 'email', 'id'),
        process.env.JWT_KEY,
        {
          algorithm: 'HS256',
          expiresIn: '150d',
        }
      );

      reply({ token, uid: user.uid });
    } else {
      reply({ error: true, message: 'incorrect password' }).code(400);
    }
  }).catch(err => reply({
    error: true,
    message: 'server error',
  }));
};

module.exports = {
  method: 'POST',
  path: '/auth',
  handler: auth,
  config: {
    validate: {
      payload: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
    },
  },
};
