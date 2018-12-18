const { sendMail, verifyEmail } = require('./emailHelper');

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

jest.mock('axios', () => ({
  create: () => ({
    defaults: { headers: { common: {} } },
    get: () =>
      new Promise((resolve, reject) => {
        reject({ error: 'invalid api token' });
      }),
  }),
}));

describe('#####Invalid API Token', () => {
  it('Returns a 401 response', async done => {
    const validEmail = verifyEmail('some.email@andela.com');

    expect(validEmail).rejects.toEqual(
      new Error({ error: 'invalid api token' })
    );
    done();
  });
});

jest.clearAllMocks();
