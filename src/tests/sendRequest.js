const request = require('supertest');

const { token } = require('../server/middlewares/authentication');

const app = require('../index');

const userToken = token({
  id: 3453,
  roleId: 3,
  username: 'Batian Muthoga',
});

module.exports = (method, url, payload, callback, token) => {
  request(app)
    [method](url)
    .set('Authorization', token || userToken)
    .send(payload)
    .end((err, res) => {
      callback(err, res);
    });
};
