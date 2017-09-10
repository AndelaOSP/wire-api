const jwt = require('jsonwebtoken');
const Joi = require('joi');
const pick = require('lodash/pick');

function auth(req, reply, profile) {
    googleAuthUri = "https://accounts.google.com/o/oauth2/auth?redirect_uri="
    + process.env.AUTH_REDIRECT_URL + "&response_type=code&client_id="
    + process.env.CLIENT_ID +
    "&scope=https://www.googleapis.com/auth/analytics.readonly+" +
    "https://www.googleapis.com/auth/userinfo.email&approval_prompt=force&access_type=offline"

    if(req.query.code == undefined){
        return reply.redirect(googleAuthUri)
    }

    var code = req.query.code;
    postCode(code);





//   if(req.query.error)
//     if(profile) {
//         if (profile.email.split('@')[1] !== 'andela.com')
//           return reply({'token': 0})

//       // extract the relevant data from Profile to store in JWT object
//       var session = {
//         firstname : profile.name.givenName, // the person's first name e.g: Anita
//         image    : profile.image.url,      // profile image url
//         id       : profile.id,             // google+ id
//         email    : profile.email,          // email address
//         exp      : Math.floor(new Date().getTime()/1000) + 7*24*60*60, // Expiry in seconds!
//       }
//       // create a JWT to set as the cookie:
//       var token = JWT.sign(session, process.env.JWT_SECRET);

//       // reply to client with a view
//       return reply.redirect('/incidents')
//       .state('token', token);
//     }
//     else {
//       return reply({'token': 0})
//     }
  }


  // We need this to build our post string
  var querystring = require('querystring');
  var http = require('http');
  var fs = require('fs');

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
};
