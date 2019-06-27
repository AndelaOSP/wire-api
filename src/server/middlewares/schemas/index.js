const Joi = require('joi');

const locationSchema = {
  name: Joi.string().required(),
  centre: Joi.string().required(),
  country: Joi.string().required(),
};

const userSchema = {
  userId: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
  username: Joi.string().required(),
  imageUrl: Joi.string(),
  roleId: Joi.number(),
};

const updateUserSchema = {
  userId: Joi.string(),
  email: Joi.string().email(),
  username: Joi.string(),
  imageUrl: Joi.string(),
  roleId: Joi.number(),
};

const incidentReporterSchema = {
  ...userSchema,
  reporterLocation: locationSchema,
};

const witnessSchema = {
  ...userSchema,
  witnessLocation: locationSchema,
};

const noteSchema = {
  note: Joi.string().required(),
  userEmail: Joi.string()
    .email()
    .required(),
};

const incidentUserSchema = {
  userId: Joi.string().required(),
  incidentId: Joi.string().required(),
};

const incidentSchema = {
  id: Joi.string(),
  statusId: Joi.number(),
  subject: Joi.string().required(),
  description: Joi.string().required(),
  dateOccurred: Joi.required(),
  levelId: Joi.string().required(),
  location: locationSchema,
  incidentReporter: incidentReporterSchema,
  witnesses: Joi.array()
    .items(witnessSchema)
    .required(),
  assignee: incidentUserSchema,
  ccd: Joi.array().items(incidentUserSchema),
};

const incidentUpdateSchema = {
  statusId: Joi.number(),
  subject: Joi.string(),
  description: Joi.string(),
  dateOccurred: Joi.date(),
  levelId: Joi.string(),
  location: locationSchema,
  incidentReporter: incidentReporterSchema,
  witnesses: Joi.array().items(witnessSchema),
  assignee: incidentUserSchema,
  ccd: Joi.array().items(incidentUserSchema),
};

const { userId, ...rest } = userSchema;

const newUserSchema = {
  ...rest,
  roleId: Joi.number().required(),
  location: locationSchema,
};

module.exports = {
  locationSchema,
  userSchema,
  incidentReporterSchema,
  witnessSchema,
  incidentSchema,
  incidentUpdateSchema,
  newUserSchema,
  noteSchema,
  updateUserSchema,
};
