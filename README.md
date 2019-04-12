[![Coverage Status](https://coveralls.io/repos/github/AndelaOSP/wire-api/badge.svg?branch=develop)](https://coveralls.io/github/AndelaOSP/wire-api?branch=develop)
[![CircleCI](https://circleci.com/gh/AndelaOSP/wire-api/tree/develop.svg?style=svg)](https://circleci.com/gh/AndelaOSP/wire-api/tree/develop)

# wire-api

WIRE-API powers [WIRE](https://github.com/AndelaOSP/wire)

### Quick Set-up

Ensure you have the following installed locally:

- [Postgres](https://www.postgresql.org/)

- [Node](https://nodejs.org/en/)

Clone repo:

```
git clone https://github.com/AndelaOSP/wire-api.git
```

Navigate to repo:

```
cd wire-api/src
```

Install all dependencies:

```
yarn install
```

Start Postgres and create a database named `wire_dev` if it does not exist.

Set up the environment variables appropriately by renaming `.env.example` to `.env`. 

Ensure the `.env` file has the following key value pairs for your local setup


| Key                    | Description                                              | Value                              |
| ---------------------- | -------------------------------------------------------- | ---------------------------------- |
| NODE_ENV               | Environment you are running the app                      | development                        |
| DATABASE_URL           | Postgres url for the database                            | postgres://localhost:5432/wire_dev |
| PORT                   | Port the app is listening to                             | 3000                               |
| SECRET_KEY             | Secret key used to generate the api tokens               | consult team lead                  |
| EMAIL_SENDER           | Email address used to send invite emails               | consult team lead                  |
| EMAIL_PASSWORD          |    Password for the above email address            | consult team lead                  |
| EMAIL_VERIFICATION_URL | Andela user service endpoint for listing users               | consult team lead                  |
| API_TOKEN              | Authorization token used while querying the user service | consult team lead                  |

Run migrations and seeders:

```
yarn run migrate-seed
```

Start the dev server:

```
yarn start:dev
```

Navigate to the port and test the endpoints on postman

### Screenshots

<img width="1097" alt="wire-api" src="https://user-images.githubusercontent.com/16113214/30543777-f7e5ad12-9c8c-11e7-80e0-b5fd3fa36546.png">

### Api Documentation

The API documentation can be found here:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/36756909f8349f8b606f)
