const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const Auth = (req, res, next) => {
  const token = req.query.token || req.headers['authorization'];

  if (!token) {
    return res.status(401).send({
      success: false,
      message: 'No token provided',
    });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log('[server-api] client token cannot be verified!');
      return res.status(401).json({
        success: false,
        message: 'Invalid token provided',
      });
    }
    console.log('[server-api] client token verified!');

    res.locals.currentUser = decoded;

    return next();
  });
};

const isAdmin = (req, res, next) => {
  const Admin = 3;

  if (res.locals.currentUser.roleId === Admin) {
    return next();
  }

  return res.status(403).send({ message: 'You are not an Authorised user' });
};

/**
 * Checks if user viewing incidents is an assignee or admin
 * @function canViewIncidents
 * @param Request Object
 * @param Response Object
 * @param function next()
 **/
const canViewIncidents = (req, res, next) => {
  const { roleId } = res.locals.currentUser;

  if (roleId === 2 || roleId === 3) {
    return next();
  }

  res.status(403).send({ message: 'You are not an Authorised user' });
};

const token = ({ id, roleId, username }) => {
  return jwt.sign({ id, roleId, username }, secretKey, { expiresIn: '24h' });
};

module.exports = { isAdmin, canViewIncidents, Auth, token };
