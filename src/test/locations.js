const chaiHttp = require('chai-http');
const chai = require('chai');
const request = require('supertest');
const should = require('chai').should;
const expect = require('chai').expect;
const assert = chai.assert;
const sinon = require('sinon');

const location = require('../server/models').Locations;
const app = require('../index');

chai.use(chaiHttp);

const testLocation = {
  name: 'Cafeteria',
  centre: 'Nairobi',
  country: 'Kenya'
};

describe('/POST locations', () => {
  const locationsEndpoint = '/api/locations';

  it('should fail to add a location', done => {
    let createStub = sinon.stub(location, 'create').rejects();
    request(app)
      .post(locationsEndpoint)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        createStub.restore();
        done();
      });
  });

  it('should fail when Location.findOrCreate fails', done => {
    let createStub = sinon.stub(location, 'findOrCreate').rejects({});
    request(app)
      .post(locationsEndpoint)
      .send(testLocation)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        createStub.restore();
        done();
      });
  });
});

describe('/GET locations', () => {
  it('Should return all the locations', function(done) {
    let findAllStub = sinon.stub(location, 'findAll').resolves(Object({}, ''));
    request(app)
      .get('/api/locations')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        assert.deepEqual(res.body, {
          data: {
            locations: {}
          },
          status: 'success'
        });
        findAllStub.restore();
        done();
      });
  });

  it('Should  fail to return all locations', function(done) {
    let findAllStub = sinon.stub(location, 'findAll').rejects(Object({}, ''));
    request(app)
      .get('/api/locations')
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        assert.deepEqual(res.body, {});
        findAllStub.restore();
        done();
      });
  });
});
