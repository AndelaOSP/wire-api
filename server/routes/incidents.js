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
      const data = await incidents.getIncidents();
      reply(data)
    }
  },

  {
    method: 'GET',
    path: '/incidents/{id}',
    handler: async (req, reply) => {
      const [ data ] = await incidents.getIncident(req.params.id);
      if (data) return reply(data);
      return reply(Boom.notFound('no record found'));
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

  {
    method: 'GET',
    path: '/locations',
    handler: async (req, reply) => {
      const locations = await incidents.getLocations();
      return reply(locations);
    },
  },

  {
    method: 'GET',
    path: '/levels',
    handler: async (req, reply) => {
      const levels = await incidents.getLevels();
      return reply(levels);
    },
  },

  {
    method: 'POST',
    path: '/categories',
    handler: async (req, reply) => {
      const [ added ] = await incidents.createIncidentCategory(req.payload);
      if (added) return reply({ id: added });
      return reply(Boom.badImplementation);
    },
    config: {
      validate: {
        payload: {
          name: Joi.string().min(3).required(),
          level_id: Joi.number().required(),
          visible: Joi.boolean(),
        },
      },
    },
  },

  {
    method: 'GET',
    path: '/categories',
    handler: async (req, reply) => {
      const cats = await incidents.getIncidentCategories();
      return reply(cats);
    },
  },
];