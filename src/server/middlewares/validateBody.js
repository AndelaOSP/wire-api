const Joi = require('joi');

module.exports = (req, res, next, schema) => {
  if (req.body.email) {
    const email = req.body.email;
    req.body.email = email.toLowerCase();
  }
  Joi.validate(req.body, schema, error => {
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    next();
  });
};
