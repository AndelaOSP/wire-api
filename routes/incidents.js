const Joi = require('joi');
const Boom = require('boom');

const incidents = require('../services/incidents');

module.exports = [
  {
    method: 'POST',
    path: '/incidents',
    handler: async (req, reply) => {
      // TODO: get userId from the token
      // req.auth.credentials.id
      const userId = 1; // hardcoded for now
      const [ added ] = await incidents.createIncident(req.payload, userId);
      if (!added) return reply(Boom.badImplementation('something wrong happend'));
      return reply({ id: added });
    },
    config: {
      validate: {
        payload: {
          description: Joi.string().required(),
          category_id: Joi.number().required(),
          location_id: Joi.number().required(),
          date_occurred: Joi.date().required(),
        },
      },
    },
  },
  
  
  /*
  Get all incidents
  */
  
  {
    method: 'GET',
    path: '/incidents',
    handler: async (req, reply) => {
      // Gets all incidents
      // req.auth.credentials.id
      const data = await incidents.viewIncidents();
      console.log(data);
      reply({ data })
    }
  },

  /*
  Get incident by ID
  */

  {
    method: 'GET',
    path: '/incidents/{id}',
    handler: async (req, reply) => {
      const [ getOne ] = await incidents.viewOneIncident(req.params.id);
      reply(getOne);
    },
  },

  {
    method: 'PATCH',
    path: '/incidents/{id}',
    handler: async (req, reply) => {
      // TODO: get userId from the token
      // req.auth.credentials.id
      const updated = await incidents.updateIncident(req.payload, req.params.id);
      reply({ updated });
    },
    config: {
      validate: {
        payload: {
          description: Joi.string(),
          category_id: Joi.number(),
          date_occurred: Joi.date(),
          status_id: Joi.number(),
        },
      },
    },
  },

];
