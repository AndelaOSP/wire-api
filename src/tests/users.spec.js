const sendRequest = require('./sendRequest');

const testUser = {
  email: 'eugene.omar@andela.com',
  username: 'Eugene Omar',
  roleId: 1,
  imageUrl: 'https://ca.slack-edge.com/T02R3LKBA-U4GHQF7BQ-89b22f3000e2-48',
  location: {
    name: 'Oculus',
    centre: 'Nairobi',
    country: 'Kenya',
  },
};

const newUser = {
  ...testUser,
  email: 'oliver.omar@andela.com',
  username: 'Oliver Omar',
};

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: (options, call) => {
      call();
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

describe('User tests', () => {
  it('should create a user', done => {
    sendRequest('post', '/api/users', newUser, (err, res) => {
      expect(res.body.data).toHaveProperty('id');
      done();
    });
  });

  it('should  login an authorised user', done => {
    sendRequest(
      'post',
      '/api/users/login',
      { email: 'eugene.omar@andela.com' },
      (err, res) => {
        expect(res.body.message).toEqual('You were successfully logged in');
        done();
      }
    );
  });

  it('should not login an unauthorised user', done => {
    sendRequest(
      'post',
      '/api/users/login',
      { email: 'batian.sss@andela.com' },
      (err, res) => {
        expect(res.body.message).toEqual('You are not aunthorized');
        done();
      }
    );
  });

  it('should not login an user with missing email', done => {
    sendRequest('post', '/api/users/login', {}, (err, res) => {
      expect(res.body.message).toEqual('Email missing');
      done();
    });
  });

  it('should not login a user who does not exist', done => {
    sendRequest(
      'post',
      '/api/users/login',
      { email: 'john.ssdoe@gmail.com' },
      (err, res) => {
        expect(res.body.message).toEqual('User does not exist');
        done();
      }
    );
  });

  it('Should return all the users', done => {
    sendRequest('get', '/api/users', null, (err, res) => {
      expect(res.body.data.users.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should retrieve one user by id', done => {
    sendRequest(
      'get',
      '/api/users/cjl6efcka00004tny9ilz7b61',
      null,
      (err, res) => {
        expect(res.body.id).toEqual('cjl6efcka00004tny9ilz7b61');
        done();
      }
    );
  });

  it('should rsearch users', done => {
    sendRequest('get', '/api/users/search?q=bat', null, (err, res) => {
      expect(res.body.data.users.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should return message if query is not provided in search', done => {
    sendRequest('get', '/api/users/search', null, (err, res) => {
      expect(res.body.message).toEqual('query missing');
      done();
    });
  });

  it('InviteUser: Should create a user if they dont exist', done => {
    sendRequest(
      'post',
      '/api/users/invite',
      {
        email: 'oliver.munala@andela.com',
        roleId: 3,
        locationId: 'cjee24cz40000guxs6bdner6l',
      },
      (err, res) => {
        expect(res.body.data.username).toEqual('Oliver Munala');
        done();
      }
    );
  });

  it('InviteUser: Should fail if roleId is not 1', done => {
    sendRequest(
      'post',
      '/api/users/invite',
      {
        email: 'joseph.nzau@andela.com',
        roleId: 3,
        locationId: 'cjee24cz40000guxs6bdner6l',
      },
      (err, res) => {
        expect(res.body.message).toMatch(
          /The user with that email address already exists/
        );
        done();
      }
    );
  });

  it('InviteUser: Should not invite a user with invalid email', done => {
    sendRequest(
      'post',
      '/api/users/invite',
      {
        email: 'joseph.nzau@gmail.com',
        roleId: 3,
        locationId: 'cjee24cz40000guxs6bdner6l',
      },
      (err, res) => {
        expect(res.body.message).toMatch(
          /You can only invite Andela users through their Andela emails/
        );
        done();
      }
    );
  });

  it('InviteUser: Should update a user if they already exist', done => {
    sendRequest(
      'post',
      '/api/users/invite',
      {
        email: 'batian.sss@andela.com',
        roleId: 1,
        locationId: 'cjee24n0n0000hfxsefer9tjh',
      },
      (err, res) => {
        expect(res.body.data.username).toEqual('Batian Sss');
        done();
      }
    );
  });

  it('Should edit the given user if they exist', done => {
    sendRequest(
      'patch',
      '/api/users/cjl6efcka00004tny9ilz7b61',
      { roleId: '1' },
      (err, res) => {
        expect(res.body.data.roleId).toEqual(1);
        done();
      }
    );
  });

  it('Should delete a user successfully', done => {
    sendRequest(
      'delete',
      '/api/users/cjpjfaq5h0000fim3xv1ijlpa',
      null,
      (err, res) => {
        expect(res.body.message).toEqual('User deleted Successfully');
        done();
      }
    );
  });
});

jest.clearAllMocks();
