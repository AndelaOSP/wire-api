const controllers = require('../controllers/index');
const incidentsService = controllers.incidents;
const locationsService = controllers.locations;
const notesService = controllers.notes;
const categoriesService = controllers.categories;
const chatsService = controllers.chats;
const usersService = controllers.users;

const { Auth, isAdmin } = require('../middlewares/authentication'); // authorise routes

module.exports = app => {
  app.get('/api', (req, res) =>
    res.status(200).send({
      message: 'Log an incident on WIRE'
    })
  );
  // incidents endpoints
  app.post('/api/incidents', incidentsService.create);
  app.get('/api/incidents', [Auth, isAdmin], incidentsService.list);
  app.get('/api/incidents/:id', [Auth, isAdmin], incidentsService.findById);
  app.put('/api/incidents/:id', Auth, incidentsService.update);
  app.get('/api/search/incidents', [Auth, isAdmin], incidentsService.search);
  app.delete('/api/incidents/:id', [Auth, isAdmin], incidentsService.delete);

  // locations endpoints
  app.post('/api/locations', locationsService.create);
  app.get('/api/locations', locationsService.list);

  // notes endpoints
  app.post('/api/incidents/:id/notes', notesService.create);
  app.get('/api/incidents/:id/notes', notesService.list);
  app.get('/api/notes/:id', notesService.findById);
  app.put('/api/notes/:id', notesService.update);
  app.delete('/api/notes/:id', notesService.delete);

  // categories endpoints
  app.get('/api/categories', categoriesService.list);

  // chats endpoints
  app.post('/api/incidents/:id/chats', chatsService.create);
  app.get('/api/incidents/:id/chats', chatsService.list);
  app.get('/api/chats/:id', chatsService.findById);
  app.put('/api/chats/:id', chatsService.update);
  app.delete('/api/chats/:id', chatsService.delete);

  // filter incidents
  app.get(
    '/api/categories/:id/incidents',
    Auth,
    incidentsService.listIncidents
  );

  // users endpoints
  app.post('/api/users', usersService.create);
  app.post('/api/users/login', usersService.login);
  app.get('/api/users', usersService.list);
  app.get('/api/users/:userId', usersService.getUserById);
};
