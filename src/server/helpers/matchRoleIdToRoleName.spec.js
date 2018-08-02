const matchRoleIdToRoleName = require('./matchRoleIdToRoleName');
const chai = require('chai');
const assert = chai.assert;

describe('#####MatchRoleIdToRoleName', () => {
  it('should create a username given an email', async () => {
    const roleName = await matchRoleIdToRoleName(2);
    assert.equal(roleName.name, 'Admin');
  });
});
