const incidentsService = require("../services/index").incidents;


module.exports = (app) => {
  app.get('/api', (req,res) => res.status(200).send({
    message: "Log an incident on WIRE"
  }));

app.post('/api/incidents', incidentsService.create);
app.get('/api/incidents', incidentsService.list);
app.get('/api/incidents/:id', incidentsService.findById);
app.put('/api/incidents/:id', incidentsService.update);
app.delete('/api/incidents/:id', incidentsService.delete);
}
