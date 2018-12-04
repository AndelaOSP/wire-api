const Incident = require('../../models').Incidents;
module.exports = async (req, res, next) => {
  const incident = await Incident.findById(req.params.id);
  if (!incident) {
    return res.status(404).send({ message: 'Incident not found' });
  }
  res.locals.incident = incident;
  next();
};
