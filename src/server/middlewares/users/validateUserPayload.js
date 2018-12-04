const Joi = require('joi');
const { newUserSchema } = require('../schemas');

module.exports = (req, res, next) => {
  Joi.validate(req.body, newUserSchema, error => {
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    next();
  });
};
