const { sendRequest } = require('./helpers/request');

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: (options, call) => {
      call('error');
    },
  }),
}));

jest.mock('axios', () => ({
  create: () => ({
    defaults: { headers: { common: {} } },
    get: () => ({
      data: {
        values: [{}],
        total: 1,
      },
    }),
  }),
}));
describe('Invite failure tests', () => {
  it('InviteUser: Should create a user if email is not sent', done => {
    sendRequest(
      'post',
      '/api/users/invite',
      {
        email: 'olive.munala@andela.com',
        roleId: 3,
        locationId: 'cjee24xnn0000i2xsh9qauyn5',
      },
      (err, res) => {
        expect(res.body.data.username).toEqual('Olive Munala');
        done();
      }
    );
  });
});

jest.clearAllMocks();
