const chaiHttp = require('chai-http');
const chai = require('chai');
const request = require('supertest');
const should = require('chai').should;
const expect = require('chai').expect;
const assert = chai.assert;
const sinon = require('sinon');

const note = require('../server/models').Notes;
const incident = require('../server/models').Incidents;
const user = require('../server/controllers/users').Users;

const app = require('../index');
chai.use(chaiHttp);

describe('/POST note', () => {
  const notesEndpoint = '/api/incidents/:id/notes';

  it('should fail to add a note', done => {
    let createStub = sinon.stub(note, 'create').rejects();
    request(app)
      .post(notesEndpoint)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        createStub.restore();
        done();
      });
  });
});

describe('/PUT note', () => {
  it('should fail to update when note id is not found', done => {
    let findByIdStub = sinon.stub(note, 'findById').resolves();
    request(app)
      .put('/api/notes/cjfm86c2r0001ris1w0or7g59')
      .expect(404)
      .end((err, res) => {
        if (err) throw err;
        findByIdStub.restore();
        done();
      });
  });
});

describe('/GET note', () => {
  it('Should return all the notes', done => {
    let findAllStub = sinon.stub(note, 'findAll').resolves(Object({}, ''));
    request(app)
      .get('/api/incidents/:id/notes')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        assert.deepEqual(res.body, {
          data: {
            notes: {}
          },
          status: 'success'
        });
        findAllStub.restore();
        done();
      });
  });

  it('Should fail to return all the notes', done => {
    let findAllStub = sinon.stub(note, 'findAll').rejects(Object({}, ''));
    request(app)
      .get('/api/incidents/:id/notes')
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        assert.deepEqual(res.body, {});
        findAllStub.restore();
        done();
      });
  });

  it('should fail to retrieve one note', done => {
    let findByIdStub = sinon.stub(note, 'findById').resolves();
    request(app)
      .get('/api/notes/:id')
      .expect(404)
      .end((err, res) => {
        if (err) throw err;
        findByIdStub.restore();
        done();
      });
  });

  it('should fail to retrieve one note when error occurs', done => {
    let findByIdStub = sinon.stub(note, 'findById').rejects();
    request(app)
      .get('/api/notes/:id')
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        findByIdStub.restore();
        done();
      });
  });

  describe('/PUT note', () => {
    it('should fail to update when document id not found', done => {
      let findByIdStub = sinon.stub(note, 'findById').resolves();
      request(app)
        .put('/api/notes/1')
        .expect(404)
        .end((err, res) => {
          if (err) throw err;
          findByIdStub.restore();
          done();
        });
    });

    it('should update fields sucessfully', done => {
      let findByIdStub = sinon.stub(note, 'findById').resolves({
        update: () =>
          new Promise((resolve, reject) => {
            resolve({});
          })
      });
      request(app)
        .put('/api/notes/:id')
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          findByIdStub.restore();
          done();
        });
    });
  });

  describe('/DELETE note', () => {
    it('should fail to delete when noteId is not found', done => {
      let findByIdStub = sinon.stub(note, 'findById').resolves();
      request(app)
        .delete('/api/notes/:id')
        .expect(404)
        .end((err, res) => {
          if (err) throw err;
          findByIdStub.restore();
          done();
        });
    });
  });

  it('should delete a note successfully ', done => {
    let findByIdStub = sinon.stub(note, 'findById').resolves({
      destroy: () =>
        new Promise((resolve, reject) => {
          resolve(true);
        })
    });
    let destroyStub = sinon.stub(note, 'destroy').resolves({});
    request(app)
      .delete('/api/notes/:id')
      .expect(204)
      .end((err, res) => {
        if (err) throw err;
        findByIdStub.restore();
        destroyStub.restore();
        done();
      });
  });
});
