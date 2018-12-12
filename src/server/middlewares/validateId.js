module.exports = async (req, res, next, Model) => {
  const row = await Model.findById(req.params.id);

  const rowName = Model.name.toLowerCase().substr(0, Model.name.length - 1);

  if (!row) {
    return res.status(404).send({ message: `${rowName} not found` });
  }

  res.locals[rowName] = row;

  next();
};
