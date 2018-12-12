const { sendMail } = require('./emailHelper');

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: (options, call) => {
      call();
    },
  }),
}));

describe('#####EmailHelper', () => {
  it('sends an email', () => {
    const callback = jest.fn();

    sendMail(
      { to: 'someone', subject: 'something', message: 'some message' },
      callback
    );

    expect(callback).toHaveBeenCalled();
  });
});

jest.clearAllMocks();
