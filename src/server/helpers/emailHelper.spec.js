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

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: (options, call) => {
      call('error');
    },
  }),
}));

describe('#####Email failure', () => {
  it('sends an error', () => {
    const callback = jest.fn();

    sendMail(
      { to: 'someone', subject: 'something', message: 'some error' },
      callback
    );

    expect(callback).toHaveBeenCalledWith('error');
  });
});

jest.clearAllMocks();
