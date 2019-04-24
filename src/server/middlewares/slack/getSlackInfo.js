const axios = require('axios');
const models = require('../../models/index');

async function createSlackUser({user: {id, profile}}) {
  const slackUser = await models.slackUsers.findById(id);

  if (!slackUser) {
    models.slackUsers.create({
      id,
      username: profile.real_name,
      email: profile.email
    });
  }

}

async function getSlackUsers(userId) {
  const res = await axios.get('https://slack.com/api/users.info?token=' + process.env.SLACK_TOKEN + '&user=' + userId + '&pretty=1');
  let payload = res.data;

  if (!payload.error) {
    await createSlackUser(payload);
  }

  return payload.error;
}

const getSlackChannel = (channelId, userId) => {
  axios.get('https://slack.com/api/channels.info?token=' + process.env.SLACK_TOKEN + '&channel=' + channelId + '&pretty=1')
    .then(res => {
      let payload = res.data;

      if (!payload.error) {
        models.slackUsers.findById(userId).then(slackUser2 => {
          if (slackUser2) {
            slackUser2.update({
              channelName: payload.channel.name,
            });
          }
        })
      }

      return payload.error;
    })
};

module.exports = {getSlackUsers, getSlackChannel};
