const { incidentSchema, incidentUpdateSchema } = require('../schemas');
const validateBody = require('../validateBody');

module.exports = {
  validateNewIncidentBody: (req, res, next) => {
    validateBody(req, res, next, incidentSchema);
  },
  validateUpdateIncidentBody: (req, res, next) => {
    validateBody(req, res, next, incidentUpdateSchema);
  },
};
