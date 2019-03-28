const axios = require('axios');
const models = require('../../models/index');

const getSlackUsers = (user_id, event_id) => {
  axios.get('https://slack.com/api/users.info?token=' + process.env.SLACK_TOKEN + '&user=' + user_id + '&pretty=1')
    .then(res => {
      let payload = res.data;

      if (!payload.error) {
        return models.userSlackEvents.create({
          username: payload.user.profile.real_name,
          slackEventId: event_id,
        });
      }

      return payload.error;
    });

};

const getSlackChannel = (channel_id, event_id) => {
  axios.get('https://slack.com/api/channels.info?token=' + process.env.SLACK_TOKEN + '&channel=' + channel_id + '&pretty=1')
    .then(res => {
      let payload = res.data;

      if (!payload.error) {
        models.userSlackEvents.findOne({
          where: {
            slackEventId: event_id,
          }
        }).then((userSlackEvent) => {
          if (userSlackEvent) {
            userSlackEvent.update({
              channel_name: payload.channel.name,
            });
          }
        })
      }

      return payload.error;
    })
};

module.exports = {getSlackUsers, getSlackChannel};
