const sendRequest = require('./sendRequest');

describe('/GET roles', () => {
  it('Should return all the roles', done => {
    sendRequest('get', '/api/roles', null, (err, res) => {
      expect(res.body.data.roles.length).toBeGreaterThan(0);
      done();
    });
  });
});
