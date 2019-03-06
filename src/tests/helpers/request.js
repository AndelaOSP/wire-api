/* eslint-disable import/no-extraneous-dependencies */
const request = require('supertest');

const { token } = require('../../server/middlewares/authentication');

const { server, socket } = require('../../index');

const userToken = token({
  id: 3453,
  roleId: 3,
  username: 'Batian Muthoga',
});

module.exports = {
  sendRequest: (method, url, payload, callback, token) => {
    request(server)
      [method](url)
      .set('Authorization', token || userToken)
      .send(payload)
      .end((err, res) => {
        callback(err, res);
      });
  },
  serverSocket: socket,
};
