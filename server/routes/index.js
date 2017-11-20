// combine all the routes
const fs = require('fs');

let routes = [];

let exclude = [ 'index.js', 'auth.js' ];

fs.readdirSync(__dirname)
  .filter(file => !exclude.includes(file))
  .forEach(file => {
    routes = routes.concat(require(`./${file}`))
  });

module.exports = routes;
