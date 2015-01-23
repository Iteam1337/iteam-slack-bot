'use strict';

var flip   = require('flip-text');

/**
 * Flip, rage or unflip
 * @param  {array} commands - Array of commands
 * @param  {string} user - User ID
 * @param  {object} slack - Slack
 * @return {string} - Prepared string
 */
function doFlip (commands, user, slack) {
  var flips = {
    flip: '(╯°□°）╯︵ ',
    rage: '(ノಠ益ಠ)ノ彡 ',
    unflip: ' ノ( º _ ºノ)'
  };

  user = slack.getUserByID(user);
  var type = commands[0];

  var flipped = !commands[1] ? '┻━┻' : commands[1] === 'me' ? flip(user.profile.first_name.toLowerCase()) : flip(commands[1].toLowerCase());

  var returnValue = type !== 'unflip' ? flips[type] + flipped : flipped + flips[type];

  return returnValue;
}

module.exports = {
  doFlip: doFlip
};