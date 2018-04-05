const chaiHttp = require('chai-http');
const chai = require('chai');
const request = require('supertest');
const should = require('chai').should;
const expect = require('chai').expect;
const assert = chai.assert;
const sinon = require('sinon');

const user = require('../server/models').Users;
const app = require('../index');

chai.use(chaiHttp);

const testUser = {
  id: 'U7LEPG8LF',
  email: 'batian.muthoga@andela.com',
  username: 'Batian Muthoga',
  imageUrl:
    'https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png',
  roleId: 2
};

describe('/POST user', () => {
  const usersEndpoint = '/api/users';

  it('should fail when User.findOrCreate fails', done => {
    let createStub = sinon.stub(user, 'findOrCreate').rejects({});
    request(app)
      .post(usersEndpoint)
      .send(testUser)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        createStub.restore();
        done();
      });
  });
});
