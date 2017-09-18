# wire-api
WIRE-API


### Quick Set-up

MySQL setup
- Import the MySQL dump to your `wire_dev` DB and you're good to go.

Install all dependencies:

```
yarn install
```

Set up the environment variables appropriately by renaming `.env.example` to `.env` and updating it.


Start the dev server:

```
yarn start:dev
```

### Authentication

Just redirect the user to the ```/auth``` endpoint for authentication with Gmail:

On success, this will return a token, which is then used on all subsequent requests by setting it in the Authorization header.

```
Authorization: Bearer 'token'
```
### Screenshots
