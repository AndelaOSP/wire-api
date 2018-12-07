const generateEmailBody = require('./generateEmailBody');

describe('#####GenerateEmailBody', () => {
  it('should generate the email body', async () => {
    const email = 'eugene.omar@andela.com';
    const roleId = 3;
    const emailBody = await generateEmailBody(email, roleId);
    const body = {
      subject: 'Invite to join WIRE',
      message:
        'Hi <strong>Eugene Omar </strong>,<br/> \n' +
        `You've been invited to join ${'<strong>'}WIRE(Workspace Incident Reporting)</strong> as Admin. \n` +
        ' Click on the following link https://wire.andela.com:8080/ to access WIRE.',
      to: 'eugene.omar@andela.com',
    };
    expect(emailBody.subject).toEqual('Invite to join WIRE');
  });
});
