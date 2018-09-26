const chaiHttp = require('chai-http');
const chai = require('chai');
const request = require('supertest');
const assert = chai.assert;
const sinon = require('sinon');
const nodemailer = require('nodemailer');

const user = require('../server/models').Users;
const app = require('../index');

chai.use(chaiHttp);

const testUser = {
  userId: 'U7LEPG8LF',
  email: 'batian.muthoga@andela.com',
  username: 'Batian Muthoga',
  imageUrl:
    'https://avatars.slack-edge.com/2018-01-31/308111298950_b15a779680c4d2bb093c_48.png',
  location: {
    name: 'Oculus',
    centre: 'Nairobi',
    country: 'Kenya'
  }
};

describe('/POST user', () => {
  const usersEndpoint = '/api/users';

  it('should fail when User.findOrCreate fails', done => {
    let createStub = sinon.stub(user, 'findOrCreate').rejects({});
    request(app)
      .post(usersEndpoint)
      .send(testUser)
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        createStub.restore();
        done();
      });
  });
  
  it('should not login in an unauthorised user', done => {
    let findOneStub = sinon.stub(user, 'findOne').rejects();

    request(app)
      .post('/api/users/login')
      .send({
        email: 'john.doe@gmail.com',
        password: 'astrongpassword'
      })
      .expect(401)
      .end((err, res) => {
        if (err) throw err;
        assert.equal(res.body.message, 'You are not authorised');
        findOneStub.restore();
        done();
      });
  });

  it('Should return all the users', done => {
    let findAllStub = sinon.stub(user, 'findAll').resolves(Object({}, ''));
    request(app)
      .get('/api/users')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        assert.deepEqual(res.body, {
          data: {
            users: {}
          },
          status: 'success'
        });
        findAllStub.restore();
        done();
      });
  });

  it('should retrieve one user by id', done => {
    let findByIdStub = sinon
      .stub(user, 'findById')
      .resolves({ id: 'U7LEPG8LF' });
    request(app)
      .get('/api/users/U7LEPG8LF')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        assert.deepEqual(res.body, { id: 'U7LEPG8LF' });
        findByIdStub.restore();
        done();
      });
  });

  it('Should return all the users', () => {
    const users = [
      {
        'id': '23hgvunervjjn',
        'email': 'oliver.munala@andela.com',
        'username': 'Oliver Munala',
        'imageUrl': null,
        'createdAt': '2018-07-25T16:03:27.893Z',
        'updatedAt': '2018-07-25T16:03:27.893Z',
        'locationId': null,
        'roleId': 3
      },
      {
        'id': 'cjkib5qa20000ssyxe7sdtqrc',
        'email': 'eugene.omar@andela.com',
        'username': 'Eugene Omar',
        'imageUrl': null,
        'createdAt': '2018-08-06T13:24:58.827Z',
        'updatedAt': '2018-08-06T13:24:58.827Z',
        'locationId': 'cjkbgs8cz0000cmyxytfbkksu',
        'roleId': 3
      },
      {
        'id': 'cjkieik4d0000k5yxci2eycpr',
        'email': 'brian.kimokoti@andela.com',
        'username': 'Brian Kimokoti',
        'imageUrl': null,
        'createdAt': '2018-08-06T14:58:56.222Z',
        'updatedAt': '2018-08-06T14:58:56.222Z',
        'locationId': 'cjkbgs8cz0000cmyxytfbkksu',
        'roleId': 3
      }
    ];
    let findAllStub = sinon.stub(user, 'findAll').resolves(Object({users}, ''));
    request(app)
      .get('/api/users/search?q=Brian')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        assert.deepEqual(res.body, {
          data: {
            users: {users}
          },
          status: 'success'
        });
        findAllStub.restore();
      });
  });

  it('Should edit the given user if they exist', (done) => {
    request(app)
      .put('/api/users/cjl6efcka00004tny9ilz7b61')
      .send({
        'roleId': '1'
      })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        assert.deepEqual(res.body.data.roleId, 1);
        done();
      });
  });

  it('InviteUser: Should not reinvite an existing user', (done) => {
    request(app)
      .post('/api/users/invite')
      .send({
        'email': 'eugene.omar@andela.com',
        'roleId': 3,
        'locationId': 'cjkbgs8cz0000cmyxytfbkksu'
      })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;
        assert.equal(res.body.message, 'The user with that email address already exists as an Admin . Try updating their role');
        done();
      });
  });

  it('InviteUser: Should create a user if they dont already exist', (done) => {
    sinon.stub(nodemailer, 'createTransport').callsFake(()=> ({
      sendMail: (options, call) => {
        call();
      }}));
    request(app)
      .post('/api/users/invite')
      .send({
        'email': 'oliver.munala@andela.com',
        'roleId': 3,
        'locationId': 'cjee24cz40000guxs6bdner6l'
      })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        assert.equal(res.body.data.username, 'Oliver Munala');
        done();
      });
  });

  it('Should delete a user successfully', (done) => {
    request(app)
      .delete('/api/users/U7LHY6T4B')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        assert.equal(res.body.message, 'User deleted Successfully');
        done();
      });
  });
});
