/* eslint-disable max-lines-per-function */
const controllers = require('../controllers/index');

const incidentsService = controllers.incidents;
const locationsService = controllers.locations;
const notesService = controllers.notes;
const categoriesService = controllers.categories;
const usersService = controllers.users;
const rolesService = controllers.roles;
const { catchErrors } = controllers;

const {
  Auth,
  isAdmin,
  canViewIncidents,
} = require('../middlewares/authentication'); // authorise routes
const {
  validateIncidentPayload,
  validateIncidentUpdatePayload,
  validateIncidentId,
  validateUserPayload,
  validateUpdateBody,
  validateUserId,
  validateNotePayload,
  validateNoteId,
} = require('../middlewares');

module.exports = app => {
  app.get('/api', (req, res) =>
    res.status(200).send({
      message: 'Log an incident on WIRE',
    })
  );

  //no auth needed
  app.post('/api/incidents', validateIncidentPayload, incidentsService.create);
  app.post('/api/users/login', usersService.login);

  app.use(Auth);
  // locations endpoints
  app.post('/api/locations', locationsService.create);
  app.get('/api/locations', locationsService.list);

  // filter incidents
  app.get('/api/categories/:id/incidents', incidentsService.listIncidents);

  app.use([Auth, canViewIncidents]);
  app.get('/api/incidents', incidentsService.list);

  app.use('/api/incidents/:id', validateIncidentId);

  app.get('/api/incidents/:id', incidentsService.findById);
  app.put(
    '/api/incidents/:id',
    validateIncidentUpdatePayload,
    incidentsService.update
  );

  // notes endpoints
  app.post(
    '/api/incidents/:id/notes',
    validateNotePayload,
    notesService.create
  );
  app.get('/api/incidents/:id/notes', notesService.list);
  app.use('/api/notes/:id', validateNoteId);
  app.get('/api/notes/:id', notesService.findById);
  app.put('/api/notes/:id', validateNotePayload, notesService.update);
  app.delete('/api/notes/:id', notesService.delete);

  // categories endpoints
  app.get('/api/categories', categoriesService.list);

  // only authorised admins can do the shit below
  app.use([Auth, isAdmin]);
  app.get('/api/search/incidents', incidentsService.search);
  app.delete('/api/incidents/:id', incidentsService.delete);

  // admin accessible user endpoints
  app.post('/api/users', validateUserPayload, usersService.create);
  app.get('/api/users', usersService.list);
  app.post('/api/users/invite', usersService.inviteUser);
  app.get('/api/users/search', usersService.searchUser);
  app.use('/api/users/:id', validateUserId);
  app.patch('/api/users/:id', validateUpdateBody, usersService.editUser);
  app.delete('/api/users/:id', usersService.deleteUser);
  app.get('/api/users/:id', usersService.getUserById);

  // roles endpoints
  app.get('/api/roles', rolesService.list);

  // Setup a default catch-all route that sends back a welcome message in JSON format.
  app.get('*', (req, res) => {
    res.status(200).send({
      message: 'Welcome to WIRE.',
    });
  });

  app.use(catchErrors);
};
