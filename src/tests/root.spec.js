/* eslint-disable max-lines-per-function */
const { sendRequest } = require('./helpers/request');

const request = require('supertest');

const { server } = require('../index');

const { token } = require('../server/middlewares/authentication');

const notAdminToken = token({
  id: 3453,
  roleId: 2,
  username: 'Batian Muthoga',
});

const cannotViewIncidentsToken = token({
  id: 3453,
  roleId: 1,
  username: 'Batian Muthoga',
});

const makeRequest = (done, message, token) => {
  let getRequest = request(server).get('/');
  if (token) getRequest = getRequest.set('Authorization', token);
  getRequest.expect(401).end((err, res) => {
    expect(res.body.message).toEqual(message);
    done();
  });
};

describe('Root tests', () => {
  it('should return welcome message', done => {
    sendRequest('get', '', null, (err, res) => {
      expect(res.body.message).toEqual('Welcome to WIRE.');
      done();
    });
  });

  it('should return login message', done => {
    sendRequest('get', '/api', null, (err, res) => {
      expect(res.body.message).toBe('Log an incident on WIRE');
      done();
    });
  });

  it('should return error if token is not provided', done => {
    makeRequest(done, 'No token provided');
  });

  it('should return error if token is invalid', done => {
    makeRequest(done, 'Invalid token provided', 'invalid token');
  });

  it('should return error if user is not authorized on admin endpoints', done => {
    makeRequest(done, 'You are not an Authorised user', notAdminToken);
  });

  it('should return error if user is not authorized to view incidents', done => {
    makeRequest(
      done,
      'You are not an Authorised user',
      cannotViewIncidentsToken
    );
  });
});
