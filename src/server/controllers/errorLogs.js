const slack = require('slack-error-notify');

/**
 * Represents a function method to catch and log errors to slack.
 * @function
 */

const catchErrors = error => {
  let MY_SLACK_WEBHOOK_URL = process.env.SLACK_BUG_WEBHOOK_URL;
  const slack = require('slack-error-notify')(MY_SLACK_WEBHOOK_URL);
  slack.bug(slack.log(error));
};

/**
 * Represents a module export.
 * @exports
 */
module.exports = {
  catchErrors
};
