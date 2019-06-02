const SlackChannel = require('../models').SlackChannels

module.exports = {
  create: async (req, res) => {
    let { incidentId, channelId, channelName, channelMembers } = req.body
    const slackChannel = SlackChannel.create({
      incidentId,
      channelId,
      channelName,
      channelMembers
    })
      .then(response => {
        res.status(201).send({ status: "success", data: response })
      })
      .catch(error => {
        res.status(400).send({ status: "failure", error })
      })

  },
}