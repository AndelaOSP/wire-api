const {
  makeServerCall,
  assigneeRequestBody,
} = require('./incidentsTestHelper.js');

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: (options, call) => {
      call('error');
    },
  }),
}));

describe('Incident Tests Email', () => {
  it('should return error email is not sent', done => {
    makeServerCall(assigneeRequestBody, done, 'put');
  });
});

jest.clearAllMocks();
