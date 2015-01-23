'use strict';

/**
 * Logs an error message and sends an empty message to chat
 * @param  {string} message - Message to add in error
 * @param  {object} channel - Channel object
 */
function log (message, channel) {
  console.error('Error: ' + message);
  channel.send('');
}

module.exports = {
  log: log
};