const Joi = require('joi');

const notes = require('../services/notes');

module.exports = [
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
