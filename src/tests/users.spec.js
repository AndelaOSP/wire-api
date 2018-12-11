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

  it('InviteUser: Should create a user if they dont already exist', done => {
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

  it('InviteUser: Should update a user if they already exist', done => {
    sendRequest(
      'post',
      '/api/users/invite',
      {
        email: 'batian.sss@andela.com',
        roleId: 1,
        locationId: 'cjee24cz40000guxs6bdner6l',
      },
      (err, res) => {
        expect(res.body.data.username).toEqual('Batian Sss');
        done();
      }
    );
  });

  it('Should edit the given user if they exist', done => {
    sendRequest(
      'put',
      '/api/users/cjl6egyei00005dnytqp4a06l',
      { ...testUser, roleId: '1' },
      (err, res) => {
        expect(res.body.data.roleId).toEqual(1);
        done();
      }
    );
  });

  it('Should delete a user successfully', done => {
    sendRequest(
      'delete',
      '/api/users/cjl6egyei00005dnytqp4a06l',
      null,
      (err, res) => {
        expect(res.body.message).toEqual('User deleted Successfully');
        done();
      }
    );
  });
});

jest.clearAllMocks();
