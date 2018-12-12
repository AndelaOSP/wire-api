const Note = require('../server/models').Notes;
const sendRequest = require('./sendRequest');

const testPayload = {
  userEmail: 'batian.muthoga@andela.com',
  note: 'This is a sample note',
};

let noteId;
const notesEndpoint = '/api/incidents/cjfkubrlv0001tsjksuis3/notes';

describe('NOTE tests', () => {
  beforeEach(done => {
    sendRequest('post', notesEndpoint, testPayload, (err, res) => {
      expect(res.body.data).toHaveProperty('id');
      noteId = res.body.data.id;
      done();
    });
  });

  it('should fail to add a note with wrong payload', done => {
    sendRequest('post', notesEndpoint, null, (err, res) => {
      expect(res.body.message).toEqual('"note" is required');
      done();
    });
  });

  it('Should return all the notes', done => {
    sendRequest('get', notesEndpoint, null, (err, res) => {
      expect(res.body.data.notes.length).toEqual(1);
      done();
    });
  });

  it('Should fail when the incident is not found', done => {
    const notesUrl = '/api/incidents/cjfkubrlv0001tsjksuis34/notes';
    sendRequest('get', notesUrl, null, (err, res) => {
      expect(res.body.message).toEqual('incident not found');
      done();
    });
  });

  it('should fail to retrieve one note if it not found', done => {
    sendRequest(
      'get',
      '/api/notes/cjfkubrlv0001tsjksuis3e4',
      null,
      (err, res) => {
        expect(res.body.message).toEqual('note not found');
        done();
      }
    );
  });

  it('should get a note successfully', done => {
    sendRequest('get', `/api/notes/${noteId}`, null, (err, res) => {
      expect(res.body.data.note).toEqual(testPayload.note);
      done();
    });
  });

  it('should fail to update when note id not found', done => {
    sendRequest('put', '/api/notes/1', null, (err, res) => {
      expect(res.body.message).toEqual('note not found');
      done();
    });
  });

  it('should update fields sucessfully', done => {
    sendRequest(
      'put',
      `/api/notes/${noteId}`,
      { ...testPayload, note: 'new note' },
      (err, res) => {
        expect(res.body.data.note).toEqual('new note');
        done();
      }
    );
  });

  it('should fail to delete when noteId is not found', done => {
    sendRequest('delete', '/api/notes/fdfgddgdgdgdgdgd', null, (err, res) => {
      expect(res.body.message).toEqual('note not found');
      done();
    });
  });

  it('should delete a note successfully ', done => {
    sendRequest('delete', `/api/notes/${noteId}`, null, err => {
      expect(err).toBeNull();
      done();
    });
  });

  afterEach(done => {
    Note.destroy({ where: { id: noteId } }).then(() => {
      noteId = null;
      done();
    });
  });
});
