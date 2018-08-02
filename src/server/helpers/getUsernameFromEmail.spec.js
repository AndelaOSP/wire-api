const getUsernameFromEmail = require('./getUsernameFromEmail');
const chai = require('chai');
const assert = chai.assert;

describe('#####GetUsernameFromEmail', () => {

  it('should create a username given an email', () => {
    const username = getUsernameFromEmail('eugene.omar@andela.com');
    assert.equal(username.first, 'Eugene');
  });
});
