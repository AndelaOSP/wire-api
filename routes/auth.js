const jwt = require('jsonwebtoken');
const Joi = require('joi');
const pick = require('lodash/pick');

function auth(req, reply, profile) {
    if(profile) {
        if (profile.email.split('@')[1] !== 'andela.com')
          return reply({'token': 0})

      // extract the relevant data from Profile to store in JWT object
      var session = {
        firstname : profile.name.givenName, // the person's first name e.g: Anita
        image    : profile.image.url,      // profile image url
        id       : profile.id,             // google+ id
        email    : profile.email,          // email address
        exp      : Math.floor(new Date().getTime()/1000) + 7*24*60*60, // Expiry in seconds!
      }
      // create a JWT to set as the cookie:
      var token = JWT.sign(session, process.env.JWT_SECRET);

      // reply to client with a view
      return reply.redirect('/incidents')
      .state('token', token);
    }
    else {
      return reply({'token': 0})
    }
  }
module.exports = {
  method: 'POST',
  path: '/auth',
  handler: auth,
};
