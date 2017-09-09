const Boom = require('boom');
const Joi = require('joi');


const notes = require('../services/notes');

module.exports = [
  {
    method: 'POST',
    path: '/incidents/{id}/notes',
    handler: async (req, reply) => {
      const [ added ] = await notes.createNote(req.params.id, req.payload.note);
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
    path: '/incidents/{id}/notes',
    handler: async (req, reply) => {
      const notesList = await notes.getNotes(req.params.incident_id);
      reply(notesList);
    },
  }
];
