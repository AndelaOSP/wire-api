const slack = require('slack-error-notify');

const catchErrors = (error, req, res) => {
  let MY_SLACK_WEBHOOK_URL = process.env.SLACK_BUG_WEBHOOK_URL;
  const slack = require('slack-error-notify')(MY_SLACK_WEBHOOK_URL);
  slack.bug(slack.log(error));
  res.status(500).send('Something broke! The team is working on it.');
};

module.exports = {
  catchErrors,
};
