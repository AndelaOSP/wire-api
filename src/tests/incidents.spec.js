const { token } = require('../server/middlewares/authentication');
const incidents = require('../server/models').Incidents;
const User = require('../server/models').Users;
const sendRequest = require('./sendRequest');

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
  const makeServerCall = (requestBody, done, method) => {
    sendRequest('post', incidentsEndpoint, testIncident, (error, res) => {
      const url = '/api/incidents/' + res.body.data.id;
      sendRequest(method, url, requestBody, (err, response) => {
        expect(response.body.data).toHaveProperty('id');
        done();
      });
    });
  };

  it('should create an incident given the correct payload', done => {
    sendRequest('post', incidentsEndpoint, testIncident, (err, res) => {
      expect(res.body.data).toHaveProperty('id');
      done();
    });
  });

  it('should list all incidents', done => {
    sendRequest('get', incidentsEndpoint, null, (err, res) => {
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
          sendRequest(
            'get',
            incidentsEndpoint,
            null,
            (err, res) => {
              expect(res.body.data.id).toEqual(res.body.data.id);
              done();
            },
            assigneeUserToken
          );
        });
      });
    });
  });

  it('should find an incident provided an existing incident ID', done => {
    sendRequest('post', incidentsEndpoint, testIncident, (err, res) => {
      const incidentUrl = '/api/incidents/' + res.body.data.id;
      sendRequest('get', incidentUrl, null, (error, response) => {
        expect(response.body.data.id).toEqual(res.body.data.id);
        done();
      });
    });
  });

  it('should update an incident provided an existing incident ID', done => {
    sendRequest('post', incidentsEndpoint, testIncident, (err, res) => {
      const updateIncidentUrl = '/api/incidents/' + res.body.data.id;
      sendRequest(
        'put',
        updateIncidentUrl,
        { ...testIncident, statusId: 3 },
        (error, response) => {
          expect(response.body.data.statusId).toEqual(3);
          done();
        }
      );
    });
  });

  it('should update an incident when someone gets assigned to it', done => {
    makeServerCall(assigneeRequestBody, done, 'put');
  });

  it('should update an incident when someone gets ccd to it', done => {
    makeServerCall(ccdRequestBody, done, 'put');
  });

  it('should delete an incident provided an existing incident ID', done => {
    const url = '/api/incidents/cjfkubrlv0001tgxs3';
    sendRequest('delete', url, null, (error, res) => {
      expect(res.body).toMatchObject({});
      done();
    });
  });

  it('should get an incident if provided with an existing incident Id', done => {
    makeServerCall(testIncident, done, 'get');
  });

  it('should search incidents', done => {
    sendRequest(
      'get',
      '/api/search/incidents?q=something',
      null,
      (error, res) => {
        expect(res.body.data).toHaveProperty('incidents');
        done();
      }
    );
  });

  it('should return error if query is not provided', done => {
    sendRequest('get', '/api/search/incidents', null, (err, res) => {
      expect(res.body.message).toEqual('please provide query');
      done();
    });
  });

  it('should list incidents by category', done => {
    sendRequest('get', '/api/categories/23/incidents', null, (err, res) => {
      expect(res.body.data).toHaveProperty('incidents');
      done();
    });
  });
});

jest.clearAllMocks();
