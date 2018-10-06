const controllers = require('../controllers/index');
const incidentsService = controllers.incidents;
const locationsService = controllers.locations;
const notesService = controllers.notes;
const categoriesService = controllers.categories;
const chatsService = controllers.chats;
const usersService = controllers.users;
const rolesService = controllers.roles;

const { Auth, isAdmin, canViewIncidents } = require('../middlewares/authentication'); // authorise routes

module.exports = app => {
  app.get('/api', (req, res) =>
    res.status(200).send({ message:'Log an incident on WIRE'
    })
  );
 
  //no auth needed
  app.post('/api/incidents', incidentsService.create);
  app.post('/api/users/login', usersService.login);

  app.use([Auth]);
  // locations endpoints
  app.post('/api/locations', locationsService.create);
  app.get('/api/locations', locationsService.list);

  // filter incidents
  app.get('/api/categories/:id/incidents', incidentsService.listIncidents);

  app.use([
    Auth,
    canViewIncidents
  ]);
  app.get('/api/incidents', incidentsService.list);
  app.get('/api/incidents/:id', incidentsService.findById);
  app.put('/api/incidents/:id', incidentsService.update);

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


  // only authorised admins can do the shit below
  app.use([Auth, isAdmin]);
  app.get('/api/search/incidents', incidentsService.search);
  app.delete('/api/incidents/:id', incidentsService.delete);

  // admin accessible user endpoints
  app.post('/api/users', usersService.create);
  app.get('/api/users', usersService.list);
  app.put('/api/users/:userId', usersService.editUser);
  app.delete('/api/users/:userId', usersService.deleteUser);
  app.post('/api/users/invite', usersService.inviteUser);
  app.get('/api/users/search', usersService.searchUser);
  app.get('/api/users/:userId', usersService.getUserById);

  // roles endpoints
  app.get('/api/roles', rolesService.list);
};
