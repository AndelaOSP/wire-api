const controllers = require("../controllers/index");
const incidentsService = controllers.incidents;
const locationsService = controllers.locations;
const statusService = controllers.status;


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
}
