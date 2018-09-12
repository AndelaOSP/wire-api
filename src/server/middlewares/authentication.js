const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const Auth = (req, res, next) => {
  const token = req.query.token || req.headers['authorization'];
  if (!token) {
    return res.status(401).send({
      success: false,
      message: 'No token provided'
    });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        messsage: 'Invalid token provided'
      });
    }

    res.locals.roleId = decoded.roleId;
    res.locals.id = decoded.id;
    return next();
  });
};

const isAdmin = (req, res, next) => {
  const Admin = 3;
  if (res.locals.roleId === Admin) {
    return next();
  }
  res.status(403).send({ message: 'You are not an Authorised user' });
};

/**
@param request Object
@param response Object
@param next() function
@return next() || error message
**/
const canViewIncidents = (req, res, next) => {
  const roleId = res.locals.roleId;
  if (roleId === 2 || roleId === 3) {
    return next();
  }
  res.status(403).send({ message: 'You are not an Authorised user' });
};

const token = (id, roleId) => {
  return jwt.sign({ id, roleId }, secretKey, { expiresIn: '24h' });
};

module.exports = { isAdmin, Auth, token, canViewIncidents };
