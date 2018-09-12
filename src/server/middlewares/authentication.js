const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const models = require('../models');

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
  const Admin = 3;
  if (res.locals.roleId === Admin) {
    return next();
  }
  res.status(403).send({ message: 'You are not an Authorised user' });
};

/**
* Checks if user viewing incidents is an assignee or admin
* @function canViewIncidents
* @param Request Object
* @param Response Object
* @param function next()
**/
const canViewIncidents = async (req, res, next) => {
  const isAssingee = await models.assigneeIncidents.findOne({ where: { assignedRole: 'assignee', incidentId: req.incidentId } });
  const roleId = res.locals.roleId;
  const check = roleId === 2 && isAssingee;
  if (check || roleId === 3) {
    return next();
  }
  res.status(403).send({ message: 'You are not an Authorised user' });
};

const token = (id, roleId) => {
  return jwt.sign({ id, roleId }, secretKey, { expiresIn: '24h' });
};

module.exports = { isAdmin, Auth, token };
