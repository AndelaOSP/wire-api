const matchRoleIdToRoleName = require('./matchRoleIdToRoleName');

describe('#####MatchRoleIdToRoleName', () => {
  it('should create a username given an email', async done => {
    const roleName = await matchRoleIdToRoleName(3);
    expect(roleName).toEqual('Admin');
    done();
  });
});
