const getUsernameFromEmail = require('./getUsernameFromEmail');

describe('#####GetUsernameFromEmail', () => {
  it('should create a username given an email', () => {
    const username = getUsernameFromEmail('eugene.omar@andela.com');
    expect(username.first).toEqual('Eugene');
  });

  it('should create a username if email does not have a "."', () => {
    const username = getUsernameFromEmail('eugeneomar@andela.com');
    expect(username.first).toEqual('Eugeneomar');
  });
});
