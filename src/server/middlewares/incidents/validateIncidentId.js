const Incident = require('../../models').Incidents;
const validateId = require('../validateId');

module.exports = async (req, res, next) => {
  validateId(req, res, next, Incident);
};
