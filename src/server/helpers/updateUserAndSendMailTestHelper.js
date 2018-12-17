const updateUserAndSendMail = require('./updateUserAndSendMail');

const send = jest.fn();
const res = {
  status: () => ({
    send,
  }),
};

const testUser = {
  email: 'eugene.omar@andela.com',
  username: 'Eugene Omar',
  roleId: 1,
  imageUrl: 'https://ca.slack-edge.com/T02R3LKBA-U4GHQF7BQ-89b22f3000e2-48',
};

const sendEmail = async done => {
  await updateUserAndSendMail(testUser, res);

  expect(send).toHaveBeenCalledWith({
    message: 'the user role has been updated',
  });

  done();
};

module.exports = {
  sendEmail,
};
