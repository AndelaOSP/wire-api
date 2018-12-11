module.exports = async (req, res, key) => {
  await res.locals[key].destroy();

  return res.status(204).send();
};
