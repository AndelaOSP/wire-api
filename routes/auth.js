const jwt = require('jsonwebtoken');
const Joi = require('joi');
const pick = require('lodash/pick');

// We need this to build our post string
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
var passport = require('passport')

function auth(req, reply, profile) {
  // To be put to uri builder
    googleAuthUri = "https://accounts.google.com/o/oauth2/auth?redirect_uri="
    + process.env.AUTH_REDIRECT_URL + "&response_type=code&client_id="
    + process.env.CLIENT_ID +
    "&scope=https://www.googleapis.com/auth/userinfo.profile+" +
    "https://www.googleapis.com/auth/userinfo.email&approval_prompt=force&access_type=offline"

    if(req.query.code == undefined){
        return reply.redirect(googleAuthUri)
    }

    var code = req.query.code;
    postCode(code);
  }

  function postCode(code) {
    // Build the post string from an object
    var post_data = querystring.stringify({
        'code' : code,
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'redirect_uri': process.env.AUTH_REDIRECT_URL,
        'grant_type': 'authorization_code'
    });

    // An object of options to indicate where to post to
    var post_options = {
        host: 'accounts.google.com',
        path: '/o/oauth2/token/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

  }

module.exports = {
  method: 'GET',
  path: '/auth',
  handler: auth,
}
