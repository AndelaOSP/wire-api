const chaiHttp = require('chai-http');
const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { token } = require('../server/middlewares/authentication');
const incidents = require('../server/models').Incidents;
const User = require('../server/models').Users;
const nodemailer = require('nodemailer');

// const incident = require('../server/models').Incidents;
const incident = require('../server/controllers').incidents;
const app = require('../index');

chai.use(chaiHttp);

const testIncident = {
  subject: 'incident payload',
  description: 'kernjgknejrngkjerngnkre',
  location: { name: 'herer', centre: 'ewfewf', country: 'eferf' },
  dateOccurred: '01-09-2018',
  levelId: '1',
  incidentReporter: {
    userId: 'U7LEPG8LF',
    email: 'batian.muthoga@andela.com',
    username: 'Batian Muthoga',
    imageUrl:
      'https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png',
    reporterLocation: { name: 'office', country: 'USA', centre: 'New York' }
  },
  witnesses: [
    {
      userId: 'U7LEPG8LF',
      email: 'batian.muthoga@andela.com',
      username: 'Batian Muthoga',
      imageUrl:
        'https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png',
      witnessLocation: {
        name: 'office',
        centre: 'St. Catherines',
        country: 'Kenya'
      }
    },
    {
      userId: 'UBQ8DDCBF',
      email: 'eugene.omar@andela.com',
      username: 'Eugene',
      imageUrl:
        'https://secure.gravatar.com/avatar/0e2428d7bc72d6a377a261ef0d95fad5.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0006-48.png',
      witnessLocation: {
        name: 'office',
        centre: 'St. Catherines',
        country: 'Kenya'
      }
    }
  ]
};

const assigneeRequestBody = {
  assignee: {
    userId: 'cjl6egyei00005dnytqp4a06l',
    incidentId: 'cjfkubrlv0001tgxs3'
  }
};

const ccdRequestBody = {
  ccd: [
    {
      userId: 'cjl6ege6e000053nyv67otq7a',
      incidentId: 'cjfkubrlv0001tgxs3'
    }
  ]
};
let nodemailerStub;
const incidentsEndpoint = '/api/incidents';

const userToken = token({ id: 3453, roleId: 3, username: 'Batian Muthoga' });
const assigneeUserToken = token({
  id: 'cjl6ege6e000053nyv67otq7a',
  roleId: 2,
  username: 'Mercy Muchai'
});
describe('Incident Tests', () => {
  beforeEach(() => {
    const transport = {
      sendMail: (data, callback) => {
        callback(null, null);
      }
    };
    nodemailerStub = sinon
      .stub(nodemailer, 'createTransport')
      .returns(transport);
  });
  afterEach(() => {
    nodemailerStub.restore();
  });

  const testStub = queryType =>
    sinon.stub(incident, queryType).resolves(Object({}, ''));
  const createStub = testStub('create');
  const updateIncidentStub = testStub('update');

  const makeServerCall = (userToken, requestBody, done, stub) => {
    request(app)
      .post(incidentsEndpoint)
      .send(testIncident)
      .then(res => {
        request(app)
          .put('/api/incidents/' + res.body.data.id)
          .send(requestBody)
          .set('Authorization', userToken)
          .expect(200)
          .end(err => {
            // if (err) throw err;
            createStub.restore();
            stub.restore();
            done();
          });
      });
  };
  it('should create an incident given the correct payload', done => {
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

  it('should list all incidents for an Assignee', done => {
    const incidentId = 'cjfkubrlv0001tgxs3mre';
    let listStub = sinon.stub(incident, 'list').resolves(Object({}, ''));
    incidents.findById(incidentId).then(incident => {
      const assingedUserId = 'cjl6ege6e000053nyv67otq7a';
      User.findById(assingedUserId).then(user => {
        incident.addAssignee(user).then(() => {
          request(app)
            .get(incidentsEndpoint)
            .set('Authorization', assigneeUserToken)
            .expect(200)
            .end(err => {
              if (err) {
                done();
                throw err;
              }
              listStub.restore();
              done();
            });
        });
      });
    });
  });

  it('should find an incident provided an existing incident ID', done => {
    let findByIdStub = sinon
      .stub(incident, 'findById')
      .resolves(Object({}, ''));
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

  it('should update an incident when someone gets assigned to it', done => {
    return makeServerCall(
      userToken,
      assigneeRequestBody,
      done,
      updateIncidentStub
    );
  });

  it('should update an incident provided an existing incident ID', done => {
    request(app)
      .post(incidentsEndpoint)
      .send(testIncident)
      .then(res => {
        request(app)
          .put('/api/incidents/' + res.body.data.id)
          .set('Authorization', userToken)
          .send({ ...testIncident, statusId: 3 })
          .expect(200)
          .end(err => {
            if (err) throw err;
            createStub.restore();
            updateIncidentStub.restore();
            done();
          });
      });
  });

  it('should update an incident when someone gets ccd to it', done => {
    return makeServerCall(userToken, ccdRequestBody, done, updateIncidentStub);
  });

  it('should delete an incident provided an existing incident ID', done => {
    const deleteIncidentStub = testStub('delete');
    makeServerCall(userToken, testIncident, done, deleteIncidentStub);
  });

  it('should list an incident if provided with an existing incident Id', done => {
    const listIncidentsByIdStub = testStub('listIncidents');
    makeServerCall(userToken, testIncident, done, listIncidentsByIdStub);
  });
});
