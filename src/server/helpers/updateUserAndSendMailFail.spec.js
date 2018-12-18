const { sendEmail } = require('./updateUserAndSendMailTestHelper');

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: (options, call) => {
      call('error');
    },
  }),
}));

describe('#####UpdateUserEmail failure', () => {
  it('calls callback with an error', async done => {
    sendEmail(done);
  });
});

jest.clearAllMocks();
