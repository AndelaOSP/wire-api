const axios = require('axios');

const postChat = (text) => {

  const res = axios.post('https://hooks.slack.com/services/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', {
    text: text
  } );

  return res.data;
};

module.exports = {postChat};

