
require('dotenv').config();

let database = process.env.DB_NAME;
if (process.env.NODE_ENV == 'test') {
  database = process.env.DB_NAME_TEST;
}

module.exports = {

  default: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database,
      charset: 'utf8',
    }
  }
};