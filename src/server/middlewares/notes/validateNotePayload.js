const Joi = require('joi');
const { noteSchema } = require('../schemas');
module.exports = (req, res, next) => {
  Joi.validate(req.body, noteSchema, error => {
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    next();
  });
};
