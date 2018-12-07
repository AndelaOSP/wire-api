const generateEmailBody = require('./generateEmailBody');

describe('#####GenerateEmailBody', () => {
  it('should generate the email body', async () => {
    const email = 'eugene.omar@andela.com';
    const roleId = 3;
    const emailBody = await generateEmailBody(email, roleId);
    expect(emailBody.subject).toEqual('Invite to join WIRE');
  });
});
