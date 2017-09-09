# wire-api
WIRE-API


### Quick Set-up

~~**Cancelled**~~
Import the skeleton PSQL dump:

1. Create the database: `createdb wire_dev`
2. `cd` into the project directory
3. Log into `psql`: `psql -d wire_dev`
4. `\i db\wire.psql`

MySQL setup
- Import the MySQL dump to your `wire_dev` DB and you're good to go.

Install all dependensies:

```
yarn install
```

Set up the environment variables appropriately by renaming `.env.example` to `.env` and updating it.


Start the dev server:

```
yarn start:dev
```
