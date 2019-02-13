const dotenv = require('dotenv');

dotenv.config();

const defaultConfig = {
  dialect: process.env.DATABASE_DIALECT || 'postgres',
  use_env_variable: 'DATABASE_URL',
  WIRE_BASE_URL: process.env.WIRE_BASE_URL,
};

module.exports = {
  development: {
    ...defaultConfig,
  },
  staging: {
    ...defaultConfig,
    WIRE_BASE_URL: process.env.WIRE_STAGING_URL,
  },
  test: {
    ...defaultConfig,
    use_env_variable: 'DATABASE_URL_TEST',
    logging: false,
  },
  production: {
    ...defaultConfig,
    WIRE_BASE_URL: process.env.WIRE_PROD_URL,
  },
};
