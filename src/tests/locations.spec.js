/* eslint-disable max-lines-per-function */
const Location = require('../server/models').Locations;
const { sendRequest } = require('./helpers/request');

const testLocation = {
  name: 'Grass',
  centre: 'Nairobi',
  country: 'Kenya',
};

let id;

describe('Locations controller', () => {
  const locationsEndpoint = '/api/locations';

  afterEach(async done => {
    if (id) await Location.destroy({ where: { id } });
    done();
  });

  it('Should return all the locations', done => {
    sendRequest('get', locationsEndpoint, null, (err, res) => {
      expect(res.body.data.locations.length).toBeGreaterThan(0);
      done();
    });
  });

  it('Should not create duplicate location', done => {
    sendRequest('post', locationsEndpoint, testLocation, (error, response) => {
      ({ id } = response.body);
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

  it('Should create a location', done => {
    sendRequest('post', locationsEndpoint, testLocation, async (err, res) => {
      expect(res.body).toHaveProperty('id');
      ({ id } = res.body.id);
      done();
    });
  });
});
