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
  },

  /*
  Note-reply routes
  */
  {
    method: 'POST',
    path: '/notes/{id}/replies',
    handler: async (req, reply) => {
      const [ replies ] = await notes.createReply(req.params.id, req.payload);
      if (replies) return reply({ id: replies });
      return reply(Boom.badImplementation());
    },
    config: {
      validate: {
        payload: {
          text: Joi.string().required(),
          user_id: Joi.number().required()
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/notes/{id}/replies',
    handler: async (req, reply) => {
      const replying = await notes.getReplies(req.params.note_id);
      reply(replying);
    },
  }
];
