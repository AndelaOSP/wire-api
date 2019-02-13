const { newUserSchema, updateUserSchema } = require('../schemas');
const validateBody = require('../validateBody');

function validateNewUserBody(req, res, next) {
  return validateBody(req, res, next, newUserSchema);
}

function validateUpdateUserBody(req, res, next) {
  return validateBody(req, res, next, updateUserSchema);
}

module.exports = {
  validateNewUserBody,
  validateUpdateUserBody
};
