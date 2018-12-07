const User = require('../models').Users;
const generateEmailBody = require('../helpers/generateEmailBody');
const emailHelper = require('../helpers/emailHelper');
/**
 * @function updateUserRoleAndSendMail
 * @param Object body
 * @return Status Code & Object
 */

module.exports = async (body, res) => {
  await User.update(body, {
    where: {
      email: body.email,
    },
    returning: true,
  });
  const emailBody = await generateEmailBody(body.email, body.roleId);
  const callback = error => {
    if (error) {
      return error;
    }
    return { message: 'The email was sent successfully' };
  };
  emailHelper.sendMail(emailBody, callback);
  return res.status(200).send({ message: 'the user role has been updated' });
};
