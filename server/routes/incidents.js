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
      if (!added) return reply(Boom.badImplementation('something wrong happened'));
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
      reply({ data })
    }
  },

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

  /**
   * Add an a sentiment rating on an incidence
   */
  {
    method: 'POST',
    path: '/incidents/{id}/sentiments',
    handler: async (req, reply) => {
      // TODO: get userId from req.
      const userId = 1;
      const [added] = await incidents.addSentiment(
        req.params.id,
        req.payload.sentiment_id,
        userId
      );
      return reply({ id: added });
    },
    config: {
      validate: {
        payload: {
          sentiment_id: Joi.number().required(),
        },
      },
    },
  },
  /**
   * Get list of all sentiments for an incident
   */
  {
    method: 'GET',
    path: '/incidents/{id}/sentiments',
    handler: async (req, reply) => {
      const sentiments = await incidents.getSentiments(req.params.id);
      return reply(sentiments);
    },
  },
];
