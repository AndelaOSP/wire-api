const Note = require('../../models').Notes;
const validateId = require('../validateId');
module.exports = async (req, res, next) => {
  validateId(req, res, next, Note);
};
