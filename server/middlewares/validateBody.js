const Joi = require('joi');
module.exports = (req, res, next, schema) => {
  Joi.validate(req.body, schema, error => {
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    next();
  });
};
