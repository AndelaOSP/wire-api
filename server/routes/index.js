const incidentsService = require("../services/index").incidents;


module.exports = (app) => {
  app.get('/api', (req,res) => res.status(200).send({
    message: "Log an incident on WIRE"
  }));

app.post('/api/incidents', incidentsService.create);
}
