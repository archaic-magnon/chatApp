const moment = require('moment');

function formatMessage(username, text, id) {
  return {
    username,
    text,
    time: moment().format('h:mm a'),
    id
  };
}

module.exports = formatMessage;