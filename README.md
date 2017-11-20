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

### Slack Bot
<img width="675" alt="screen shot 2017-09-18 at 3 53 24 pm" src="https://user-images.githubusercontent.com/16113214/30543673-a9e4d4b2-9c8c-11e7-80aa-4023d29cd0ca.png">
<img width="702" alt="screen shot 2017-09-18 at 3 54 39 pm" src="https://user-images.githubusercontent.com/16113214/30543731-d35ec88e-9c8c-11e7-8f82-3ab7e2a6fd96.png">

### Wire-api
<img width="1097" alt="wire-api" src="https://user-images.githubusercontent.com/16113214/30543777-f7e5ad12-9c8c-11e7-80e0-b5fd3fa36546.png">

### Proposed Interface
![proposed](https://user-images.githubusercontent.com/16113214/30543810-13c4bdc0-9c8d-11e7-8268-6e4b533e596e.png)
