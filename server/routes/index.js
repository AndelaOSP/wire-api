const incidentsService = require("../controllers/index").incidents;
const locationsService = require("../controllers/index").locations;


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
}
