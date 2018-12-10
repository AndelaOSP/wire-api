const request = require('supertest');
const { token } = require('../server/middlewares/authentication');

const app = require('../index');

const userToken = token({ id: 3453, roleId: 3, username: 'Batian Muthoga' });

describe('/GET roles', () => {
  it('Should return all the roles', done => {
    request(app)
      .get('/api/roles')
      .set('Authorization', userToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.roles.length).toBeGreaterThan(0);
        done();
      });
  });
});
