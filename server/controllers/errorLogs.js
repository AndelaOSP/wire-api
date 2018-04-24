const slack = require('slack-error-notify');

const catchErrors = (error) => {
  let MY_SLACK_WEBHOOK_URL = process.env.SLACK_BUG_WEBHOOK_URL;
  const slack = require('slack-error-notify')(MY_SLACK_WEBHOOK_URL);
  slack.bug(slack.log(error));
};

module.exports = {
  catchErrors
};
