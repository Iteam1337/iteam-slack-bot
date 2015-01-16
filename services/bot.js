'use strict';

var LastFm = require('./lastfm');
var SL     = require('./sl');
var utils  = require('../utilities/utils');
var flip = require('flip-text');

exports.service = function () {
  return {
    /**
     * Display a random image from 9gag's hot list
     * @param  {array} commands - Array of commands
     * @param  {object} channel - Channel object
     */
    '9gag': function (commands, channel) {
      var url = 'http://infinigag.eu01.aws.af.cm/hot/0';

      utils.getDataFromURL(url)
        .then(function (data) {
          if (data && data.data) {
            var randomGag = utils.returnRandom(data.data);

            channel.send(randomGag.caption + '\n' + randomGag.images.large);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    flip: function (commands, channel, user, slack) {
      var guy = '(╯°□°）╯︵ ';
      var flipped;
      user = slack.getUserByID(user);

      flipped = !commands[1] ? '┻━┻' : commands[1] === 'me' ? flip(user.profile.first_name.toLowerCase()) : flip(commands[1].toLowerCase());

      channel.send(guy + flipped);
    },

    /**
     * Display a random FML from fmylife.com
     * @param  {array} commands - Array of commands
     * @param  {object} channel - Channel object
     */
    fml: function (commands, channel) {
      var url = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&q=http://feeds.feedburner.com/fmylife';

      utils.getDataFromURL(url)
        .then(function (fmls) {
          var randomFml = utils.returnRandom(fmls.responseData.feed.entries);
          var fml = randomFml.content.replace(/(<([^>]+)>)/ig,"") + '\n- _' + randomFml.author + '_';

          channel.send(fml);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    /**
     * Display help
     * @param  {array} commands - Array of commands
     * @param  {object} channel - Channel object
     */
    help: function (commands, channel) {
      utils.showHelp(channel)
    },

    /**
     * Displays a little hello message with the users real name
     * @param  {array} commands - Array of commands
     * @param  {object} channel - Channel object
     * @param  {string} user - User ID
     * @param  {object} slack - Slack
     */
    hej: function (commands, channel, user, slack) {
      user = slack.getUserByID(user);

      channel.send('Hej, ' + user.profile.first_name + '!');
    },

    /**
     * Display help
     * @param  {array} commands - Array of commands
     * @param  {object} channel - Channel object
     */
    hjälp: function (commands, channel) {
      utils.showHelp(channel)
    },

    /**
     * Display now playing
     * @param  {string} commands    [description]
     * @param  {object} channel - Channel object
     */
    np: function (commands, channel) {
      LastFm
        .getLastfm(commands)
        .then(function (data) {
          channel.send(data);
        });
    },

    rage: function (commands, channel, user, slack) {
      var guy = '(ノಠ益ಠ)ノ彡 ';
      var flipped;
      user = slack.getUserByID(user);

      flipped = !commands[1] ? '┻━┻' : commands[1] === 'me' ? flip(user.profile.first_name.toLowerCase()) : flip(commands[1].toLowerCase());

      channel.send(guy + flipped);
    },

    /**
     * Display SL departure times
     * @param  {array} commands - Array of commands
     * @param  {object} channel - Channel object
     */
    sl: function (commands, channel) {
      if (commands.length > 2) {
        SL.reseplaneraren(commands, channel);
      } else {
        SL.realtidsinformation(commands, channel);
      }
    },

    unflip: function (commands, channel, user, slack) {
      var guy = ' ノ( º _ ºノ)';
      var flipped;
      user = slack.getUserByID(user);

      flipped = !commands[1] ? '┻━┻' : commands[1] === 'me' ? user.profile.first_name.toLowerCase() : commands[1].toLowerCase();

      channel.send(flipped + guy);
    }
  }
};