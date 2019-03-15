const request = require('supertest');

const { server } = require('../index');

const { token } = require('../server/middlewares/authentication');

const apiToken = token({
  id: 34533,
  roleId: 3,
  username: 'Batian Muthoga',
});

jest.mock('axios', () => ({
  create: () => ({
    defaults: { headers: { common: {} } },
    get: async () => ({
      data: {
        values: [],
        total: 0,
      },
    }),
  }),
}));

describe('##### Non-andelan email', () => {
  it('Returns false when email is non-andelan', async done => {
    request(server)
      .post('/api/users/invite')
      .set('Authorization', apiToken)
      .send({
        email: 'oliveere.munala@andela.com',
        roleId: 3,
        locationId: 'cjee24xnn0000i2xsh9qauyn5',
      })
      .expect(404)
      .end((err, res) => {
        expect(res.body.message).toBe('That email does not exist');
        done();
      });
  });
});

jest.clearAllMocks();
