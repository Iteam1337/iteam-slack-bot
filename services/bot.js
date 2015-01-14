'use strict';

var LastFm  = require('./lastfm');
var request = require('request');
var Q       = require('q');

/**
 * Displays the help text
 * @param  {obj} channel - channel object
 */
function showHelp (channel) {
  var text = [
    '```Användning:',
    '@iteam [alternativ]\n',
    'Alternativ:',
    '9gag               slumpa en bild från 9gags hot-lista',
    'fml                slumpa en FML från fmylife.com',
    'help/hjälp         visar denna hjälp',
    'np                 visar vilken låt som spelas',
    'np:{användarnamn}  visar vilken låt du spelar (Last.fm-användarnamn)',
    'sl                 visar närmaste avgångarna från Rådmansgatan',
    'sl {station}       visar närmaste avgångarna från angiven station```'
  ];

  channel.send(text.join('\n'));
}

/**
 * Returns a random object from an array
 * @param  {array} array - Array
 * @return {obj, string} - Returns random from array
 */
function returnRandom (array) {
  return array[ Math.floor( Math.random() * array.length ) ];
}

/**
 * Get data from a given URL
 * @param  {string} url - URL to get data from
 * @return {obj} - Promise
 */
function getDataFromURL (url) {
  var deferred = Q.defer();

  request(url, function (error, response, body) {
    body = JSON.parse(body);

    deferred.resolve(body);
  });

  return deferred.promise;
}

exports.service = function () {
  return {
    '9gag': function (text, channel) {
      var url = 'http://infinigag.eu01.aws.af.cm/hot/0';

      getDataFromURL(url)
        .then(function (data) {
          var randomGag = returnRandom(data.data);

          channel.send(randomGag.caption + '\n' + randomGag.images.large);
        });
    },

    /**
     * Display a random FML from fmylife.com
     * @param  {string} text    [description]
     * @param  {[type]} channel [description]
     * @return {[type]}         [description]
     */
    fml: function (text, channel) {
      var url = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&q=http://feeds.feedburner.com/fmylife';

      getDataFromURL(url)
        .then(function (fmls) {
          var randomFml = returnRandom(fmls.responseData.feed.entries);
          var fml = randomFml.content.replace(/(<([^>]+)>)/ig,"") + '\n- _' + randomFml.author + '_';

          channel.send(fml);
        });
    },

    /**
     * Display help
     * @param  {string} text    [description]
     * @param  {[type]} channel [description]
     * @return {[type]}         [description]
     */
    help: function (text, channel) {
      showHelp(channel)
    },

    hej: function (text, channel, user, slack) {
      user = slack.getUserByID(user);

      channel.send('Hej, ' + user.profile.first_name + '!');
    },

    /**
     * Display help
     * @param  {string} text    [description]
     * @param  {[type]} channel [description]
     * @return {[type]}         [description]
     */
    hjälp: function (text, channel) {
      showHelp(channel)
    },

    /**
     * Display now playing
     * @param  {string} text    [description]
     * @param  {[type]} channel [description]
     * @return {[type]}         [description]
     */
    np: function (text, channel) {
      LastFm
        .getLastfm(text)
        .then(function (data) {
          channel.send(data);
        });
    },

    /**
     * Display SL departure times
     * @param  {[type]} text    [description]
     * @param  {[type]} channel [description]
     * @return {[type]}         [description]
     */
    sl: function (text, channel) {
      var baseUrl = 'http://api.sl.se/api2/';
      var plats = baseUrl + 'typeahead.json?key={key}&searchstring={search}&stationsonly=true&maxresults=1';
      var real = baseUrl + 'realtimedepartures.json?key={key}&siteid={id}'
      var match = text.match(/sl\s[a-zåäö-]*/i);
      var station = match ? match[0].substr(3) : 'Rådmansgatan';
      
      var keyPlats = process.env.SL_PLATS;
      var keyReal = process.env.SL_REAL;

      plats = plats.replace('{key}', keyPlats).replace('{search}', station);

      request(plats, function (error, response, body) {
      getDataFromURL(plats)
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

          getDataFromURL(real)
            .then(function (body) {

            var metros = body.ResponseData.Metros;
            var departures = [];

            metros.forEach(function (metro) {
              departures.push('*' + metro.LineNumber + ' ' + metro.Destination + '*\n' + metro.DisplayTime);
            });

            channel.send('*' + name + '*\n' + departures.join('\n'));
          });          
        });
      });
    }
  }
};