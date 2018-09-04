const chaiHttp = require('chai-http');
const chai = require('chai');
const request = require('supertest');
const assert = chai.assert;
const sinon = require('sinon');
const { token } = require('../server/middlewares/authentication');

// const incident = require('../server/models').Incidents;
const incident = require('../server/controllers').incidents;
const app = require('../index');

chai.use(chaiHttp);

const testIncident = { subject: 'incident payload',
  description: 'kernjgknejrngkjerngnkre',
  location: { name: 'herer', centre: 'ewfewf', country: 'eferf' },
  dateOccurred: '01-09-2018',
  levelId: '1',
  incidentReporter:
 { slackId: 'U7LEPG8LF',
   email: 'batian.muthoga@andela.com',
   username: 'Batian Muthoga',
   imageUrl: 'https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png',
   reporterLocation: { name: 'office', country: 'USA', centre: 'New York' } },
  witnesses:
 [ { slackId: 'U7LEPG8LF',
   email: 'batian.muthoga@andela.com',
   username: 'Batian Muthoga',
   imageUrl: 'https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png',
   witnessLocation: { name: 'office', centre: 'St. Catherines', country: 'Kenya' } },
 { slackId: 'UBQ8DDCBF',
   email: 'eugene.omar@andela.com',
   username: 'Eugene',
   imageUrl: 'https://secure.gravatar.com/avatar/0e2428d7bc72d6a377a261ef0d95fad5.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0006-48.png',
   witnessLocation: { name: 'office', centre: 'St. Catherines', country: 'Kenya' } } ] };

const userToken = token(3453, 3);
describe('Incident Tests', () => {
  const incidentsEndpoint = '/api/incidents';

  it('should create an incident given the correct payload', done => {
    let createStub = sinon.stub(incident, 'create').resolves(Object({}, ''));
    request(app)
      .post(incidentsEndpoint)
      .send(testIncident)
      .expect(201)
      .end(err => {
        if (err) throw err;
        createStub.restore();
        done();
      });
  });

  it('should list all incidents', done => {
    let listStub = sinon.stub(incident, 'list').resolves(Object({}, ''));
    request(app)
      .get(incidentsEndpoint)
      .set('Authorization', userToken)
      .expect(200)
      .end(err => {
        if (err) throw err;
        listStub.restore();
        done();
      });
  });

  it('should find an incident provided an existing incident ID', done => {
    let createStub = sinon.stub(incident, 'create').resolves(Object({}, ''));
    let findByIdStub = sinon.stub(incident, 'findById').resolves(Object({}, ''));
    request(app)
      .post(incidentsEndpoint)
      .send(testIncident)
      .then(res => {
        request(app)
          .get('/api/incidents/' + res.body.data.id)
          .set('Authorization', userToken)
          .expect(200)
          .end(err => {
            if (err) throw err;
            createStub.restore();
            findByIdStub.restore();
            done();
          });
      });
  });

  it('should update an incident provided an existing incident ID', done => {
    let createStub = sinon.stub(incident, 'create').resolves(Object({}, ''));
    let updateIncidentStub = sinon.stub(incident, 'update').resolves(Object({}, ''));
    request(app)
      .post(incidentsEndpoint)
      .send(testIncident)
      .then(res => {
        request(app)
          .put('/api/incidents/' + res.body.data.id)
          .send({statusId: 3})
          .set('Authorization', userToken)
          .expect(200)
          .end(err => {
            if (err) throw err;
            createStub.restore();
            updateIncidentStub.restore();
            done();
          });
      });
  });

  it('should delete an incident provided an existing incident ID', done => {
    let createIncidentStub = sinon.stub(incident, 'create').resolves(Object({}, ''));
    let deleteIncidentStub = sinon.stub(incident, 'delete').resolves(Object({}, ''));
    request(app)
      .post(incidentsEndpoint)
      .send(testIncident)
      .then(res => {
        request(app)
          .delete('/api/incidents/' + res.body.data.id)
          .set('Authorization', userToken)
          .expect(204)
          .end(err => {
            if (err) throw err;
            createIncidentStub.restore();
            deleteIncidentStub.restore();
            done();
          });
      });
  });

  it('should list an incident if provided with an existing incident Id', done => {
    let createIncidentStub = sinon.stub(incident, 'create').resolves(Object({}, ''));
    let listIncidentsByIdStub = sinon.stub(incident, 'listIncidents').resolves(Object({}, ''));
    request(app)
      .post(incidentsEndpoint)
      .send(testIncident)
      .then(res => {
        request(app)
          .get('/api/incidents/' + res.body.data.id)
          .set('Authorization', userToken)
          .expect(200)
          .end(err => {
            if (err) throw err;
            createIncidentStub.restore();
            listIncidentsByIdStub.restore();
            done();
          });
      });
  });
});
