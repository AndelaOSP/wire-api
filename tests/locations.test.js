const request = require('supertest');

const { token } = require('../server/middlewares/authentication');
const Location = require('../server/models').Locations;
const app = require('../index');

const testLocation = {
  name: 'Grass',
  centre: 'Nairobi',
  country: 'Kenya',
};
const userToken = token({ id: 3453, roleId: 3, username: 'Batian Muthoga' });

describe('Locations controller', () => {
  const locationsEndpoint = '/api/locations';

  afterEach(() => {
    Location.destroy({ where: {} });
  });

  it('Should return all the locations', function(done) {
    request(app)
      .get(locationsEndpoint)
      .set('Authorization', userToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.locations.length).toBeGreaterThan(0);
        done();
      });
  });

  it('Should not create duplicate location', function(done) {
    request(app)
      .get(locationsEndpoint)
      .set('Authorization', userToken)
      .expect(200)
      .end((error, res) => {
        request(app)
          .get(locationsEndpoint)
          .set('Authorization', userToken)
          .expect(409)
          .end((err, res) => {
            expect(err).not.toBeNull();
            done();
          });
      });
  });

  it('Should not create location with wrong payload', function(done) {
    request(app)
      .post(locationsEndpoint)
      .set('Authorization', userToken)
      .send(testLocation)
      .expect(400)
      .end((err, res) => {
        expect(err).not.toBeNull();
        done();
      });
  });

  it('Should create a location', done => {
    request(app)
      .post(locationsEndpoint)
      .set('Authorization', userToken)
      .send(testLocation)
      .expect(200)
      .end((err, res) => {
        expect(res.body).toHaveProperty('id');
        done();
      });
  });
});
