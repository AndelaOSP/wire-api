const errorLogs = require('./errorLogs');
const Role = require('../models').Roles;

module.exports = {
  list(req, res) {
    return Role.findAll().then(role => {
      return res.status(200).send({ data: { roles: role }, status: 'success' });
    });
  },
};
