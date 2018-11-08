const chaiHttp = require('chai-http');
const chai = require('chai');
const request = require('supertest');
const { token } = require('../server/middlewares/authentication');
const assert = chai.assert;
const sinon = require('sinon');

const category = require('../server/models').Categories;
const app = require('../index');

chai.use(chaiHttp);
const userToken = token({ id: 3453, roleId: 3, username: 'Batian Muthoga' });

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
