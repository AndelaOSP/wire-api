const chaiHttp = require('chai-http');
const chai = require('chai');
const request = require('supertest');
const should = require('chai').should;
const expect = require('chai').expect;
const assert = chai.assert;
const sinon = require('sinon');

const chat = require('../server/models').Chats;
const incident = require('../server/models').Incidents;

const app = require('../index');
chai.use(chaiHttp);

const testChat = {
  incidentId: 'cjfm86c2r0001ris1w0or7g59',
  userEmail: 'batian.muthoga@andela.com',
  chat: 'smapleChat'
};

describe('/POST chat', () => {
  const chatsEndpoint = '/api/incidents/:id/chats';

  it('should fail to add a chat', done => {
    let createStub = sinon.stub(chat, 'create').rejects();
    request(app)
      .post(chatsEndpoint)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        createStub.restore();
        done();
      });
  });

  it('should fail to update when chat id is not found', done => {
    let findByIdStub = sinon.stub(chat, 'findById').resolves();
    request(app)
      .put('/api/chats/:id')
      .expect(404)
      .end((err, res) => {
        if (err) throw err;
        findByIdStub.restore();
        done();
      });
  });

  it('Should return all the chats', done => {
    let findAllStub = sinon.stub(chat, 'findAll').resolves(Object({}, ''));
    request(app)
      .get('/api/incidents/:id/chats')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        assert.deepEqual(res.body, {
          data: {
            chats: {}
          },
          status: 'success'
        });
        findAllStub.restore();
        done();
      });
  });

  it('Should fail to return all the chats', done => {
    let findAllStub = sinon.stub(chat, 'findAll').rejects(Object({}, ''));
    request(app)
      .get('/api/incidents/:id/chats')
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        assert.deepEqual(res.body, {});
        findAllStub.restore();
        done();
      });
  });

  it('should fail to retrieve one chat', done => {
    let findByIdStub = sinon.stub(chat, 'findById').resolves();
    request(app)
      .get('/api/chats/:id')
      .expect(404)
      .end((err, res) => {
        if (err) throw err;
        findByIdStub.restore();
        done();
      });
  });

  it('should fail to retrieve one chat when error occurs', done => {
    let findByIdStub = sinon.stub(chat, 'findById').rejects();
    request(app)
      .get('/api/chats/:id')
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        findByIdStub.restore();
        done();
      });
  });

  it('should fail to delete when chat id not found', done => {
    let findByIdStub = sinon.stub(chat, 'findById').resolves(Object({}, ''));
    request(app)
      .delete('/api/chat/:id')
      .expect(404)
      .end((err, res) => {
        if (err) throw err;
        findByIdStub.restore();
        done();
      });
  });

  it('should delete a chat successfully ', done => {
    let findByIdStub = sinon.stub(chat, 'findById').resolves({
      destroy: () =>
        new Promise((resolve, reject) => {
          resolve(true);
        })
    });
    let destroyStub = sinon.stub(chat, 'destroy').resolves({});
    request(app)
      .delete('/api/chats/:id')
      .expect(204)
      .end((err, res) => {
        if (err) throw err;
        findByIdStub.restore();
        destroyStub.restore();
        done();
      });
  });
});
