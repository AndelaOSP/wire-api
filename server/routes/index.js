const controllers = require('../controllers/index');
const incidentsService = controllers.incidents;
const locationsService = controllers.locations;
const statusService = controllers.status;
const levelsService = controllers.levels;
const notesService = controllers.notes;
const categoriesService = controllers.categories;
const chatsService = controllers.chats;
const rolesService = controllers.roles;
const usersService = controllers.users;

module.exports = app => {
  app.get('/api', (req, res) =>
    res.status(200).send({
      message: 'Log an incident on WIRE'
    })
  );
  // incidents endpoints
  app.post('/api/incidents', incidentsService.create);
  app.get('/api/incidents', incidentsService.list);
  app.get('/api/incidents/:id', incidentsService.findById);
  app.put('/api/incidents/:id', incidentsService.update);
  app.get('/api/search/incidents', incidentsService.search);
  app.delete('/api/incidents/:id', incidentsService.delete);

  // locations endpoints
  app.get('/api/locations', locationsService.list);
  app.get('/api/locations/:id', locationsService.findById);
  app.put('/api/locations/:id', locationsService.update);

  // statuses endpoints
  app.post('/api/status', statusService.create);
  app.get('/api/status', statusService.list);
  app.get('/api/status/:id', statusService.findById);
  app.put('/api/status/:id', statusService.update);

  // levels endpoints
  app.post('/api/levels', levelsService.create);
  app.get('/api/levels', levelsService.list);
  app.get('/api/levels/:id', levelsService.findById);
  app.put('/api/levels/:id', levelsService.update);

  // notes endpoints
  app.post('/api/incidents/:id/notes', notesService.create);
  app.get('/api/incidents/:id/notes', notesService.list);
  app.get('/api/notes/:id', notesService.findById);
  app.put('/api/notes/:id', notesService.update);
  app.delete('/api/notes/:id', notesService.delete);

  // categories endpoints
  app.post('/api/categories', categoriesService.create);
  app.get('/api/categories', categoriesService.list);
  app.get('/api/categories/:id', categoriesService.findById);
  app.put('/api/categories/:id', categoriesService.update);

  // chats endpoints
  app.post('/api/incidents/:id/chats', chatsService.create);
  app.get('/api/incidents/:id/chats', chatsService.list);
  app.get('/api/chats/:id', chatsService.findById);
  app.put('/api/chats/:id', chatsService.update);
  app.delete('/api/chats/:id', chatsService.delete);

  // roles endpoints
  app.post('/api/roles', rolesService.create);
  app.get('/api/roles', rolesService.list);
  app.get('/api/roles/:id', rolesService.findById);
  app.put('/api/roles/:id', rolesService.update);

  // filter incidents
  app.get('/api/categories/:id/incidents', categoriesService.listIncidents);
  app.get('/api/locations/:id/incidents', locationsService.listIncidents);
  app.get('/api/levels/:id/incidents', levelsService.listIncidents);

  // users endpoints
  app.post('/api/users', usersService.create);
  app.get('/api/users', usersService.list);
  app.get('/api/users/:userId', usersService.getUserById);
};
