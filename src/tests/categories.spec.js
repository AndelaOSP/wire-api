const request = require('supertest');
const { token } = require('../server/middlewares/authentication');

const app = require('../index');

const userToken = token({ id: 3453, roleId: 3, username: 'Batian Muthoga' });

describe('/GET categories', () => {
  it('Should return all the categories', done => {
    request(app)
      .get('/api/categories')
      .set('Authorization', userToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.categories.length).toBeGreaterThan(0);
        done();
      });
  });
});
