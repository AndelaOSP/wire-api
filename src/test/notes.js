const chaiHttp = require('chai-http');
const chai = require('chai');
const request = require('supertest');
const assert = chai.assert;
const sinon = require('sinon');

const Note = require('../server/models').Notes;
const { token } = require('../server/middlewares/authentication');

const app = require('../index');
chai.use(chaiHttp);
const userToken = token({ id: 3453, roleId: 3, username: 'Batian Muthoga' });
const testPayload = {
  userEmail: 'batian.muthoga@andela.com',
  note: 'This is a sample note'
};

let noteId;
const notesEndpoint = '/api/incidents/cjfkubrlv0001tsjksuis3/notes';

describe('NOTE tests', () => {
  beforeEach(done => {
    Note.create(testPayload).then(note => {
      noteId = note.id;
      done();
    });
  });

  it('should fail to add a note', done => {
    request(app)
      .post(notesEndpoint)
      .set('Authorization', userToken)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });
  it('Should return all the notes', done => {
    request(app)
      .get(notesEndpoint)
      .set('Authorization', userToken)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        assert.deepEqual(res.body, {
          data: {
            notes: []
          },
          status: 'success'
        });
        done();
      });
  });

  it('Should fail when the incident does not exist', done => {
    request(app)
      .get('/api/incidents/cjfkubrlv0001tsjksuis34/notes')
      .set('Authorization', userToken)
      .expect(404)
      .end(() => {
        done();
      });
  });

  it('should fail to retrieve one note', done => {
    request(app)
      .get('/api/notes/cjfkubrlv0001tsjksuis3e4')
      .set('Authorization', userToken)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });

  it('should get a note successfully', done => {
    request(app)
      .get(`/api/notes/${noteId}`)
      .set('Authorization', userToken)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        assert.equal(res.body.data.note, testPayload.note);
        done();
      });
  });
  it('should fail to update when note id not found', done => {
    request(app)
      .put('/api/notes/1')
      .set('Authorization', userToken)
      .expect(404)
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });

  it('should update fields sucessfully', done => {
    request(app)
      .put(`/api/notes/${noteId}`)
      .set('Authorization', userToken)
      .send({ ...testPayload, note: 'new note' })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        assert.equal(res.body.data.note, 'new note');
        done();
      });
  });

  it('should fail to delete when noteId is not found', done => {
    request(app)
      .delete(`/api/notes/fdfgddgdgdgdgdgd`)
      .set('Authorization', userToken)
      .expect(404)
      .end((err, res) => {
        done();
      });
  });
  it('should delete a note successfully ', done => {
    request(app)
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', userToken)
      .expect(204)
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });

  afterEach(done => {
    Note.destroy({ where: {} }).then(() => {
      noteId = null;
      done();
    });
  });
});
