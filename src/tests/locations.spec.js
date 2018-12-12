const Location = require('../server/models').Locations;
const sendRequest = require('./sendRequest');

const testLocation = {
  name: 'Grass',
  centre: 'Nairobi',
  country: 'Kenya',
};

describe('Locations controller', () => {
  const locationsEndpoint = '/api/locations';

  afterEach(() => {
    Location.destroy({ where: {} });
  });

  it('Should return all the locations', done => {
    sendRequest('get', locationsEndpoint, null, (err, res) => {
      expect(res.body.data.locations.length).toBeGreaterThan(0);
      done();
    });
  });

  it('Should not create duplicate location', done => {
    sendRequest('post', locationsEndpoint, testLocation, () => {
      sendRequest('post', locationsEndpoint, testLocation, (err, res) => {
        expect(res.text).toEqual('Location already exists');
        done();
      });
    });
  });

  it('Should not create a location with invalid payload', done => {
    sendRequest('post', locationsEndpoint, null, (err, res) => {
      expect(res.body.message).toEqual(
        'Location name, centre or country missing'
      );
      done();
    });
  });

  it('Should not create a duplicate location', done => {
    sendRequest('post', locationsEndpoint, testLocation, () => {
      sendRequest('post', locationsEndpoint, testLocation, (err, res) => {
        expect(res.status).toEqual(409);
        done();
      });
    });
  });

  it('Should create a location', done => {
    sendRequest('post', locationsEndpoint, testLocation, (err, res) => {
      expect(res.body).toHaveProperty('id');
      done();
    });
  });
});
