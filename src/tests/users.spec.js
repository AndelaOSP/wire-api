const request = require('supertest');
const nodemailer = require('nodemailer');
const { token } = require('../server/middlewares/authentication');

const user = require('../server/models').Users;
const app = require('../index');

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

const userToken = token({ id: 3453, roleId: 3, username: 'Batian Muthoga' });

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: (options, call) => {
      call();
    },
  }),
}));

describe('User tests', () => {
  const usersEndpoint = '/api/users';

  it('should create a user', done => {
    request(app)
      .post('/api/users')
      .set('Authorization', userToken)
      .send(newUser)
      .expect(201)
      .end((err, res) => {
        expect(res.body.data).toHaveProperty('id');
        done();
      });
  });

  it('should  login an authorised user', done => {
    request(app)
      .post('/api/users/login')
      .set('Authorization', userToken)
      .send({ email: 'eugene.omar@andela.com' })
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).toEqual('You were successfully logged in');
        done();
      });
  });

  it('should not login an unauthorised user', done => {
    request(app)
      .post('/api/users/login')
      .set('Authorization', userToken)
      .send({ email: 'batian.sss@andela.com' })
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).toEqual('You are not aunthorized');
        done();
      });
  });

  it('should not login an user with missing email', done => {
    request(app)
      .post('/api/users/login')
      .set('Authorization', userToken)
      .send({})
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).toEqual('Email missing');
        done();
      });
  });

  it('should not login a user who does not exist', done => {
    request(app)
      .post('/api/users/login')
      .set('Authorization', userToken)
      .send({ email: 'john.ssdoe@gmail.com' })
      .expect(401)
      .end((err, res) => {
        expect(res.body.message).toEqual('User does not exist');
        done();
      });
  });

  it('Should return all the users', done => {
    request(app)
      .get('/api/users')
      .set('Authorization', userToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.users.length).toBeGreaterThan(0);
        done();
      });
  });

  it('should retrieve one user by id', done => {
    request(app)
      .get('/api/users/cjl6efcka00004tny9ilz7b61')
      .set('Authorization', userToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.id).toEqual('cjl6efcka00004tny9ilz7b61');
        done();
      });
  });

  it('InviteUser: Should create a user if they dont already exist', done => {
    request(app)
      .post('/api/users/invite')
      .set('Authorization', userToken)
      .send({
        email: 'oliver.munala@andela.com',
        roleId: 3,
        locationId: 'cjee24cz40000guxs6bdner6l',
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.username).toEqual('Oliver Munala');
        done();
      });
  });

  it('InviteUser: Should update a user if they already exist', done => {
    request(app)
      .post('/api/users/invite')
      .set('Authorization', userToken)
      .send({
        email: 'batian.sss@andela.com',
        roleId: 1,
        locationId: 'cjee24cz40000guxs6bdner6l',
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.username).toEqual('Batian Sss');
        done();
      });
  });

  it('Should edit the given user if they exist', done => {
    request(app)
      .put('/api/users/cjl6egyei00005dnytqp4a06l')
      .set('Authorization', userToken)
      .send({ ...testUser, roleId: '1' })
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.roleId).toEqual(1);
        done();
      });
  });

  it('Should delete a user successfully', done => {
    request(app)
      .delete('/api/users/cjl6egyei00005dnytqp4a06l')
      .set('Authorization', userToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).toEqual('User deleted Successfully');
        done();
      });
  });
});

jest.clearAllMocks();
