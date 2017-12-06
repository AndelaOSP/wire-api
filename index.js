const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const NODE_ENV = process.env.NODE_ENV;
const port = process.env.PORT || 8000;
// load env
if (NODE_ENV !== 'development') {
  require('dotenv').load();
}

// set up the express app
const app = express();
// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Require routes
require('./server/routes/index')(app);
// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to WIRE.',
}));

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  }})

module.exports = app;
