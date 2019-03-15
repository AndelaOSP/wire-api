const { sendRequest } = require('./helpers/request');

describe('/GET categories', () => {
  it('Should return all the categories', done => {
    sendRequest('get', '/api/categories', null, (err, res) => {
      expect(res.body.data.categories.length).toBeGreaterThan(0);
      done();
    });
  });
});
