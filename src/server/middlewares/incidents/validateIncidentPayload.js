const { incidentSchema } = require('../schemas');
const validateBody = require('../validateBody');

module.exports = (req, res, next) => {
  validateBody(req, res, next, incidentSchema);
};
