const Note = require('../../models').Notes;
module.exports = async (req, res, next) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).send({ message: 'Note not found' });
  }
  res.locals.note = note;
  next();
};
