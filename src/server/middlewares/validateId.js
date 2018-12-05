module.exports = async (req, res, next, Model) => {
  const row = await Model.findById(req.params.id);
  if (!row) {
    return res.status(404).send({ message: `${Model.name} not found` });
  }
  res.locals[Model.name.toLowerCase().substr(0, Model.name.length - 1)] = row;
  next();
};
