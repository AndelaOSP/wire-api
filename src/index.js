const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const NODE_ENV = process.env.NODE_ENV;

// load env
if (NODE_ENV !== 'development') {
  require('dotenv').load();
}

// set up the express app
const app = express();

app.use(cors());

let allowedOrigins = [
  'https://wire-front-staging.herokuapp.com',
  'https://wireapi-develop.herokuapp.com',
  'wire.andela.com:8080',
  'https://wirebot-testing.herokuapp.com',
  'https://wire-bot.herokuapp.com/'
];

app.use((req, res, next) => {
  let origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) >= 0){
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type'
  );
  next();
});

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require routes
require('./server/routes/index')(app);
// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) =>
  res.status(200).send({
    message: 'Welcome to WIRE.'
  })
);

module.exports = app;
