'use strict';

var LastFm = require('./lastfm');
var utils  = require('../utilities/utils');

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

    /**
     * Display SL departure times
     * @param  {array} commands - Array of commands
     * @param  {object} channel - Channel object
     */
    sl: function (commands, channel) {
      console.log(commands);

      var baseUrl = 'http://api.sl.se/api2/';
      var plats = baseUrl + 'typeahead.json?key={key}&searchstring={search}&stationsonly=true&maxresults=1';
      var real = baseUrl + 'realtimedepartures.json?key={key}&siteid={id}'
      var station = commands[2] ? commands[2] : 'Rådmansgatan';
      
      var keyPlats = process.env.SL_PLATS;
      var keyReal = process.env.SL_REAL;

      plats = plats.replace('{key}', keyPlats).replace('{search}', station);

      utils.getDataFromURL(plats)
        .then(function (body) {
          if (body.StatusCode !== 0) {
            channel.send('Något gick snett');
            return;
          }

          if (!body.ResponseData[0]) {
            channel.send('Kan inte hitta någon station med namnet *' + station);
            return;
          }

          var name = body.ResponseData[0].Name;
          var id = body.ResponseData[0].SiteId;

          real = real.replace('{key}', keyReal).replace('{id}', id);

          utils.getDataFromURL(real)
            .then(function (body) {

            var metros = body.ResponseData.Metros;
            var departures = [];

            metros.forEach(function (metro) {
              departures.push('*' + metro.LineNumber + ' ' + metro.Destination + '*\n' + metro.DisplayTime);
            });

            channel.send('*' + name + '*\n' + departures.join('\n'));
          });          
        });
    }
  }
};