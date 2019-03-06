const app = require('express')();
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const server = require('http').Server(app);
const Socket = require('./socket');

const { NODE_ENV } = process.env;

// load env
if (NODE_ENV !== 'development') {
  require('dotenv').load();
}

// Create a socket connection for this server.
const socket = Socket(server);

// Attach socket to app for use in express middleware.
app.socket = socket;

app.use(cors());

let allowedOrigins = [
  'https://wire-front-staging.herokuapp.com',
  'https://wireapi-develop.herokuapp.com',
  'wire.andela.com:8080',
  'https://wirebot-testing.herokuapp.com',
  'https://wire-bot.herokuapp.com/',
];

app.use((req, res, next) => {
  let { origin } = req.headers;
  if (allowedOrigins.indexOf(origin) >= 0) {
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

module.exports = { server, socket };
