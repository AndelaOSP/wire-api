const incidents = require('./incidents');
const locations = require('./locations');
const notes = require('./notes');
const categories = require('./categories');
const users = require('./users');
const roles = require('./roles');
const { catchErrors } = require('./errorLogs');

module.exports = {
  incidents,
  locations,
  notes,
  categories,
  users,
  roles,
  catchErrors,
};
