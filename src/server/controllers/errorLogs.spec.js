const { catchErrors } = require('./errorLogs');

jest.mock('slack-error-notify', () => {
  return () => {
    return {
      log: () => {},
      bug: () => {},
    };
  };
});

describe('Error handler test', () => {
  it('Handles errors', () => {
    const error = 'error';
    const send = jest.fn();
    const res = {
      status: () => ({
        send,
      }),
    };

    catchErrors(error, null, res);
    expect(send).toHaveBeenCalled();
  });
});

jest.clearAllMocks();
