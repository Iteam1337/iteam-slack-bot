'use strict';

function log (message, channel) {
  console.error('Error: ' + message);
  channel.send('');
}

module.exports = {
  log: log
};