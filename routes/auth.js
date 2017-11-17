const jwt = require('jsonwebtoken');
const Joi = require('joi');

const Knex = require('../db');

async function auth(req, reply) {
  // To be put to uri builder
  const redirectUri = `https://api.andela.com/login?redirect_url=${process.env.BASE_URL}/auth`;

  if (!req.query.token) {
      return reply.redirect(redirectUri);
  }

  const payload = jwt.decode(req.query.token);

  if (!Object.keys(payload.UserInfo.roles).includes('Andelan')) {
    // redirect with a different message
    return reply.redirect(redirectUri);
  }

  const user = Object.assign({}, payload.UserInfo);
  user.andela_id = user.id;
  delete user.id;
  user.roles = Object.keys(user.roles).join(',');

  let createdOrUpdatedUser;
  let columns = [ 'id', 'andela_id', 'name', 'picture', 'roles' ];
  const [ getUser ] = await Knex('user').where({ email: user.email });
  if (!getUser) {
    // user not found
    // create the user
    createdOrUpdatedUser = await Knex('user')
      .returning(columns)
      .insert(user);
  } else {
    // update the user details
    const updated = await Knex('user')
      .update(user)
      .where({ email: user.email });

    createdOrUpdatedUser = await Knex('user')
      .select(...columns)
      .where({ email: user.email });
  }

  console.log(createdOrUpdatedUser);
  // return our token
  const token = jwt.sign(
    createdOrUpdatedUser[0],
    process.env.JWT_KEY,
    {
      algorithm: 'HS256',
      expiresIn: '400d',
    }
  );

  return reply({ token, id: createdOrUpdatedUser.id });
}

module.exports = {
  method: 'GET',
  path: '/auth',
  handler: auth,
}
