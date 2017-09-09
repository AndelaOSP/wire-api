const Boom = require('boom');
const Joi = require('joi');


const notes = require('../services/notes');

module.exports = [
  {
    method: 'POST',
    path: '/incidents/{id}/notes',
    handler: async (req, reply) => {
      const [ added ] = await notes.createNote(req.params.id, req.payload);
      if (added) return reply({ id: added });
      return reply(Boom.badImplementation());
    },
    config: {
      validate: {
        payload: {
          note: Joi.string().required(),
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/notes',
    handler: async (req, reply) => {
      const notesList = await notes.getNotes(req.params.incident_id);
      reply(notesList);
    },
    config: {
      validate: {
        query: {
          incident_id: Joi.number().required(), 
        },
      },
    },
  },
];
