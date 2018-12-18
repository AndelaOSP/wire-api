const User = require('../models').Users;
const Role = require('../models').Roles;
const Location = require('../models').Locations;
const emailHelper = require('./emailHelper');
const generateEmailBody = require('./generateEmailBody');
const checkEmail = require('./checkEmail');
const getUsernameFromEmail = require('./getUsernameFromEmail');
const updateUserAndSendMail = require('./updateUserAndSendMail');

const includeRole = {
  model: Role,
  attributes: ['name', 'id'],
};

let include = [
  includeRole,
  {
    model: Location,
    attributes: ['name', 'centre', 'country'],
  },
];

const getUserByEmail = email =>
  User.findOne({
    where: { email },
    include: includeRole,
  });

const sendEmailCallback = error => {
  if (error) {
    return error;
  }
  return { message: 'The email was sent successfully' };
};

const updateExistingUser = async (req, res, userExists) => {
  if (userExists.Role.id === 1) {
    await User.update(
      { roleId: req.body.roleId },
      { where: { email: req.body.email } }
    );

    const emailBody = await generateEmailBody(req.body.email, req.body.roleId);

    emailHelper.sendMail(emailBody, sendEmailCallback);

    const user = await User.findOne({
      where: { email: req.body.email },
      include: include,
    });

    return res.status(200).send({ data: user, status: 'success' });
  } else {
    return res.status(400).json({
      message: `The user with that email address already exists as an ${
        userExists.Role.name
      } . Try updating their role`,
    });
  }
};

const createAndInviteUser = async (req, res) => {
  const validEmail = checkEmail(req.body.email);
  const emailBody = await generateEmailBody(req.body.email, req.body.roleId);
  if (validEmail) {
    const name = getUsernameFromEmail(req.body.email);
    const userObject = {
      email: req.body.email,
      username: `${name.first} ${name.last}`,
      roleId: req.body.roleId,
      locationId: req.body.locationId,
    };
    const [createdUser] = await User.findOrCreate({
      where: { email: userObject.email },
      defaults: userObject,
    });
    emailHelper.sendMail(emailBody, sendEmailCallback);
    const user = await User.findById(createdUser.id, { include });
    return res.status(200).send({ data: user, status: 'success' });
  }
  return res.status(400).send({
    message: 'You can only invite Andela users through their Andela emails',
  });
};

module.exports = {
  getUserByEmail,
  include,
  updateExistingUser,
  createAndInviteUser,
};
