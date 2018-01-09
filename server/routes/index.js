const controllers = require("../controllers/index");
const incidentsService = controllers.incidents;
const locationsService = controllers.locations;
const statusService = controllers.status;
const levelsService = controllers.levels;
const notesService = controllers.notes;
const categoriesService = controllers.categories;
const repliesService = controllers.replies;

module.exports = (app) => {
  app.get('/api', (req,res) => res.status(200).send({
    message: "Log an incident on WIRE"
  }));
// incidents endpoints
app.post('/api/incidents', incidentsService.create);
app.get('/api/incidents', incidentsService.list);
app.get('/api/incidents/:id', incidentsService.findById);
app.put('/api/incidents/:id', incidentsService.update);
app.delete('/api/incidents/:id', incidentsService.delete);

// locations endpoints
app.post('/api/locations', locationsService.create);
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

// replies endpoints
app.post('/api/notes/:id/replies', repliesService.create);
app.get('/api/notes/:id/replies', repliesService.list);  
app.get('/api/replies/:id', repliesService.findById);
app.put('/api/replies/:id', repliesService.update);
app.delete('/api/replies/:id', repliesService.delete);
}
