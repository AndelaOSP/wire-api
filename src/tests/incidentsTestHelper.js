const { token } = require('../server/middlewares/authentication');
const sendRequest = require('./sendRequest');

const testIncident = {
  subject: 'incident payload',
  description: 'kernjgknejrngkjerngnkre',
  location: { name: 'herer', centre: 'ewfewf', country: 'eferf' },
  dateOccurred: '01-09-2018',
  levelId: '1',
  incidentReporter: {
    userId: 'cjl6efcka00004tny9ilz7b61',
    email: 'batian.muthoga@andela.com',
    username: 'Batian Muthoga',
    imageUrl:
      'https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png',
    reporterLocation: { name: 'office', country: 'USA', centre: 'New York' },
  },
  witnesses: [
    {
      userId: 'cjl6efcka00004tny9ilz7b61',
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
      userId: 'cjl6egyei00005dnytqp4a06l',
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

const makeServerCall = (requestBody, done, method, init) => {
  sendRequest('post', incidentsEndpoint, testIncident, async (error, res) => {
    if (init) await init(res);
    const url = '/api/incidents/' + res.body.data.id;
    sendRequest(method, url, requestBody, (err, response) => {
      expect(response.body.data).toHaveProperty('id');
      done();
    });
  });
};

module.exports = {
  assigneeRequestBody,
  ccdRequestBody,
  assigneeUserToken,
  makeServerCall,
  testIncident,
};
