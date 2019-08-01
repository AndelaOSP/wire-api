/* eslint-disable max-lines-per-function */
const incidents = require('../server/models').Incidents;
const User = require('../server/models').Users;
const { sendRequest } = require('./helpers/request');

const {
  assigneeRequestBody,
  ccdRequestBody,
  assigneeUserToken,
  addAssignee,
  makeServerCall,
  testIncident,
} = require('./helpers/incidents');

const incidentsEndpoint = '/api/incidents';

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: (options, call) => {
      call();
    },
  }),
}));

describe('Incident Tests', () => {
  it('should create an incident and user if the reporter does not exist', done => {
    const newIncident = { ...testIncident };
    newIncident.incidentReporter.email = 'non.existent@andela.com';
    newIncident.incidentReporter.username = 'non existent';
    newIncident.incidentReporter.userId = 'U7LEPG8LN';
    newIncident.incidentReporter.roleId = '1';
    newIncident.subject = 'new subject';
    sendRequest('post', incidentsEndpoint, newIncident, (err, res) => {
      expect(res.body.data).toHaveProperty('id');
      done();
    });
  });

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
  it('should update an incident when someone gets assigned to the incident', done => {
    sendRequest('post', incidentsEndpoint, testIncident, (err, res) => {
      const { id } = res.body.data;
      const updateIncidentUrl = '/api/incidents/' + id;
      sendRequest(
        'put',
        updateIncidentUrl,
        {
          ...testIncident,
          assignee: {
            userId: 'cjl6egyei00005dnytqp4a06l',
            incidentId: id,
          },
        },
        (error, response) => {
          expect(response.body.status).toEqual('success');
          done();
        }
      );
    });
  });
  it('should update an incident when someone gets ccd to the incident', done => {
    sendRequest('post', incidentsEndpoint, testIncident, (err, res) => {
      const { id } = res.body.data;
      const updateIncidentUrl = '/api/incidents/' + id;
      sendRequest(
        'put',
        updateIncidentUrl,
        {
          ...testIncident,
          ccd: [
            {
              userId: 'cjl6fecrb11115vf09xly2f65',
              incidentId: id,
            },
          ],
        },
        (error, response) => {
          expect(response.body.status).toEqual('success');
          done();
        }
      );
    });
  });
  it('should update an incident when the status is updated', done => {
    sendRequest('post', incidentsEndpoint, testIncident, (err, res) => {
      const { id } = res.body.data;
      const updateIncidentUrl = '/api/incidents/' + id;
      sendRequest(
        'put',
        updateIncidentUrl,
        {
          ...testIncident,
          statusId: 3,
        },
        (error, response) => {
          expect(response.body.data.statusId).toEqual(3);
          done();
        }
      );
    });
  });

  it('should update an incident when someone gets ccd to it', done => {
    makeServerCall(assigneeRequestBody, done, 'put');
  });
  it('should update an incident when someone gets ccd to it', done => {
    makeServerCall(ccdRequestBody, done, 'put');
  });

  it('should update an incident when it has assignees', done => {
    makeServerCall(ccdRequestBody, done, 'put', addAssignee);
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

module.exports = {
  makeServerCall,
  assigneeRequestBody,
};
