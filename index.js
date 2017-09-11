const Hapi = require('hapi');
const hapiAuthJwt = require('hapi-auth-jwt');
const Joi = require('joi');
const Boom = require('boom');

// load env
require('dotenv').config();

// load routes
let routes = require('./routes');
const auth = require('./routes/auth');

const env = process.env.NODE_ENV;

const config = {};
if (env == 'development') {
  config.debug = { request: [ 'error' ] };
}

const server = new Hapi.Server(config);

let port = process.env.PORT;

server.connection({ host: 'localhost', port });

server.register(hapiAuthJwt, (err) => {
  server.auth.strategy('token', 'jwt', {
    key: process.env.JWT_KEY,
    verifyOptions: {
      algorithms: [ 'HS256' ],
    },
  });

  // add auth config on all routes
  // untill we add Google OAuth
  routes = routes.map(route => {
    const authConfig = { strategy: 'token' };
    if (route.config) {
      route.config.auth = authConfig;
    } else {
      route.config = {
        auth: authConfig,
      };
    }
    return route;
  });
  server.route(routes);
});

server.route(auth);

server.route({
  method: 'GET',
  path: '/',
  handler: (req, reply) => {
    return reply({ message: 'Wire API' });
  },
});

/**
 * logging
 */
const options = {
  ops: {
    interval: 1800000 // reporting interval (30 minutes)
  },
  reporters: {
    myConsoleReporter: [
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ log: '*', error: '*', response: '*', request: '*', ops: '*' }]
      },
      { module: 'good-console' },
      'stdout',
    ]
  }
};

server.register({
  register: require('good'),
  options,
}, (err) => {
  if (err) return console.error(err);

  server.start(() => {
    // set env variable for base_url
    process.env.BASE_URL = server.info.uri;
    console.log(`Server running at: ${server.info.uri}`);
  });
});

module.exports = server;
