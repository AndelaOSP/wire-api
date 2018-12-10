const { findOrCreateLocation } = require('./locationHelper');

describe('Location helper tests', () => {
  it('should return error with wrong data', done => {
    const send = jest.fn();
    const res = {
      status: () => ({
        send,
      }),
    };
    findOrCreateLocation({}, res);
    expect(send).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Provide the location name, centre and country',
    });
    done();
  });
});
