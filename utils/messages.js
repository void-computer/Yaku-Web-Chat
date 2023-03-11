const moment = require('moment');

function formatMessage(username, text) {
    return{
        username,
        text,
        time: moment().format('h:mm a')
    }
};

function IP(username, text) {
    return{
        username,
        text,
        time: moment().format('h:mm a')
    }
};


module.exports = formatMessage;
module.exports = IP;