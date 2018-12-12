const User = require('../../models').Users;
const validateId = require('../validateId');

module.exports = async (req, res, next) => {
  validateId(req, res, next, User);
};
