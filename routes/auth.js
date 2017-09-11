const jwt = require('jsonwebtoken');
const Joi = require('joi');
const pick = require('lodash/pick');

// We need this to build our post string
var querystring = require('querystring');

function auth(req, reply, profile) {
  // To be put to uri builder
    googleAuthUri = "https://api.andela.com/login?redirect_url=" + process.env.AUTH_REDIRECT_URL

    if(req.query.token == undefined){
        return reply.redirect(googleAuthUri)
    }

    const token = req.query.token;
    const payload = jwt.decode(token)
    console.log(payload);
    const email = payload.UserInfo.email

    if(email.split('@')[1] !== 'andela.com'){
      return reply({auth: 0})
    }
    const id = payload.UserInfo.id
    const firstName = payload.UserInfo.first_name
    const lastName = payload.UserInfo.last_name
    const picture = payload.UserInfo.picture
  }

module.exports = {
  method: 'GET',
  path: '/auth',
  handler: auth,
}
