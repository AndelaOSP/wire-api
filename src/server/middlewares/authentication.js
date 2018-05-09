const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const User = require('../models').Users;

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
    res.locals.id = decoded.userId;
    return next();
  });
};

const isAdmin = (req, res, next) => {
  const Admin = 2;
  const SuperAdmin = 3;
  if (res.locals.roleId === Admin || res.locals.roleId === SuperAdmin) {
    return next();
  }
  res.status(403).send({ message: 'You are not an Authorised user' });
};
const token = (id, roleId) => {
  return jwt.sign({ id, roleId }, secretKey, { expiresIn: '24h' });
};

module.exports = { isAdmin, Auth, token };
