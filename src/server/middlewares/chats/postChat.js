const axios = require('axios');

// Read a token from the environment variables
const token = process.env.SLACK_TOKEN;

const postChat = async (text, channel, authToken = token) => {
  try {
    const res = await axios.post(
      `https://slack.com/api/chat.postMessage?token=${authToken}&channel=${channel}&text=${text}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

module.exports = { postChat };
