const sendRequest = require('./sendRequest');

const request = require('supertest');

const app = require('../index');

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

describe('Root tests', () => {
  it('should return welcome message', done => {
    sendRequest('get', '', null, (err, res) => {
      expect(res.body.message).toEqual('Welcome to WIRE.');
      done();
    });
  });

  it('should return login message', done => {
    sendRequest('get', '/api', null, (err, res) => {
      expect(res.body.message).toEqual('Log an incident on WIRE');
      done();
    });
  });

  it('should return error if token is not provided', done => {
    request(app)
      .get('/')
      .expect(401)
      .end((err, res) => {
        expect(res.body.message).toEqual('No token provided');
        done();
      });
  });

  it('should return error if token is invalid', done => {
    request(app)
      .get('/')
      .set('Authorization', 'invalid token')
      .expect(401)
      .end((err, res) => {
        expect(res.body.message).toEqual('Invalid token provided');
        done();
      });
  });

  it('should return error if user is not authorized on admin endpoints', done => {
    request(app)
      .get('/api/users')
      .set('Authorization', notAdminToken)
      .expect(401)
      .end((err, res) => {
        expect(res.body.message).toEqual('You are not an Authorised user');
        done();
      });
  });

  it('should return error if user is not authorized to view incidents', done => {
    request(app)
      .get('/api/incidents')
      .set('Authorization', cannotViewIncidentsToken)
      .expect(401)
      .end((err, res) => {
        expect(res.body.message).toEqual('You are not an Authorised user');
        done();
      });
  });
});
