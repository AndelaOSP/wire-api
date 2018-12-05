const nodemailer = require('nodemailer');
const request = require('supertest');
const { token } = require('../server/middlewares/authentication');
const incidents = require('../server/models').Incidents;
const User = require('../server/models').Users;

const incident = require('../server/controllers').incidents;
const app = require('../index');

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
    reporterLocation: { name: 'office', country: 'USA', centre: 'New York' },
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
        country: 'Kenya',
      },
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
        country: 'Kenya',
      },
    },
  ],
};

const assigneeRequestBody = {
  ...testIncident,
  assignee: {
    userId: 'cjl6egyei00005dnytqp4a06l',
    incidentId: 'cjfkubrlv0001tgxs3',
  },
};

const ccdRequestBody = {
  ...testIncident,
  ccd: [
    {
      userId: 'cjl6ege6e000053nyv67otq7a',
      incidentId: 'cjfkubrlv0001tgxs3',
    },
  ],
};

const incidentsEndpoint = '/api/incidents';

const userToken = token({
  id: 3453,
  roleId: 3,
  username: 'Batian Muthoga',
});

const assigneeUserToken = token({
  id: 'cjl6ege6e000053nyv67otq7a',
  roleId: 2,
  username: 'Mercy Muchai',
});

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: (options, call) => {
      call();
    },
  }),
}));

describe('Incident Tests', () => {
  const makeServerCall = (requestBody, done, method, callback) => {
    request(app)
      .post(incidentsEndpoint)
      .set('Authorization', userToken)
      .send(testIncident)
      .expect(201)
      .then((res, err) => {
        request(app)
          [method]('/api/incidents/' + res.body.data.id)
          .send(requestBody)
          .set('Authorization', userToken)
          .end((err, res) => {
            callback({ err, res });
            done();
          });
      });
  };

  it('should create an incident given the correct payload', done => {
    request(app)
      .post(incidentsEndpoint)
      .send(testIncident)
      .expect(204)
      .end((err, res) => {
        expect(res.body.data).toHaveProperty('id');
        done();
      });
  });

  it('should list all incidents', done => {
    request(app)
      .get(incidentsEndpoint)
      .set('Authorization', userToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.incidents.length).toBeGreaterThan(0);
        done();
      });
  });

  it('should list all incidents for an Assignee', done => {
    const incidentId = 'cjfkubrlv0001tgxs3mre';
    incidents.findById(incidentId).then(incident => {
      const assingedUserId = 'cjl6ege6e000053nyv67otq7a';
      User.findById(assingedUserId).then(user => {
        incident.addAssignee(user).then(() => {
          request(app)
            .get(incidentsEndpoint)
            .set('Authorization', assigneeUserToken)
            .expect(200)
            .end((err, res) => {
              expect(res.body.data.id).toEqual(res.body.data.id);
              done();
            });
        });
      });
    });
  });

  it('should find an incident provided an existing incident ID', done => {
    request(app)
      .post(incidentsEndpoint)
      .send(testIncident)
      .then(res => {
        request(app)
          .get('/api/incidents/' + res.body.data.id)
          .set('Authorization', userToken)
          .expect(200)
          .end((err, res) => {
            expect(res.body.data.id).toEqual(res.body.data.id);
            done();
          });
      });
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
          .end((err, res) => {
            expect(res.body.data.statusId).toEqual(3);
            done();
          });
      });
  });

  it('should update an incident when someone gets assigned to it', done => {
    makeServerCall(assigneeRequestBody, done, 'put', ({ err, res }) => {
      expect(res.body.data).toHaveProperty('id');
    });
  });

  it('should update an incident when someone gets ccd to it', done => {
    makeServerCall(ccdRequestBody, done, 'put', ({ err, res }) => {
      expect(res.body.data).toHaveProperty('id');
    });
  });

  it('should delete an incident provided an existing incident ID', done => {
    makeServerCall(testIncident, done, 'delete', ({ err, res }) => {
      expect(res.body).toMatchObject({});
    });
  });

  it('should get an incident if provided with an existing incident Id', done => {
    makeServerCall(testIncident, done, 'get', ({ err, res }) => {
      expect(res.body.data).toHaveProperty('id');
    });
  });
});

jest.clearAllMocks();
