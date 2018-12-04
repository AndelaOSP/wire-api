const User = require('../../models').Users;

module.exports = async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  res.locals.user = user;
  next();
};
