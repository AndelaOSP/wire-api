const getUsernameFromEmail = require('./getUsernameFromEmail');

describe('#####GetUsernameFromEmail', () => {
  it('should create a username given an email', () => {
    const username = getUsernameFromEmail('eugene.omar@andela.com');
    expect(username.first).toEqual('Eugene');
  });
});
