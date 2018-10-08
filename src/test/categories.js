const chaiHttp = require('chai-http');
const chai = require('chai');
const request = require('supertest');
const should = require('chai').should;
const expect = require('chai').expect;
const assert = chai.assert;
const sinon = require('sinon');
const { token } = require('../server/middlewares/authentication');

const category = require('../server/models').Categories;
const app = require('../index');

chai.use(chaiHttp);
const userToken = token(3453, 3);

describe('/GET categories', () => {
  it('Should return all the categories', function(done) {
    let findAllStub = sinon.stub(category, 'findAll').resolves(Object({}, ''));
    request(app)
      .get('/api/categories')
      .set('Authorization', userToken)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        assert.deepEqual(res.body, {
          data: {
            categories: {}
          },
          status: 'success'
        });
        findAllStub.restore();
        done();
      });
  });

  it('Should  fail to return all categories', function(done) {
    let findAllStub = sinon.stub(category, 'findAll').rejects(Object({}, ''));
    request(app)
      .get('/api/categories')
      .set('Authorization', userToken)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        assert.deepEqual(res.body, {});
        findAllStub.restore();
        done();
      });
  });
});
