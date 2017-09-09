const config = require('./config');
const Knex = require('knex')(config.default);

module.exports = Knex;
