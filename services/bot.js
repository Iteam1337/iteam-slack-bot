'use strict';

var LastFm  = require('./lastfm');
var request = require('request');

function showHelp (channel) {
  var text = [
    '```Användning:',
    '@iteam [alternativ]\n',
    'Alternativ:',
    'fml                slumpa en FML från fmylife.com',
    'help/hjälp         visar denna hjälp',
    'np                 visar vilken låt som spelas',
    'np:{användarnamn}  visar vilken låt du spelar (Last.fm-användarnamn)',
    'sl                 visar närmaste avgångarna från Rådmansgatan',
    'sl {station}       visar närmaste avångarna från angiven station```'
  ];

  channel.send(text.join('\n'));
}

exports.service = function () {
  return {
    /**
     * Display a random FML from fmylife.com
     * @param  {string} text    [description]
     * @param  {[type]} channel [description]
     * @return {[type]}         [description]
     */
    fml: function (text, channel) {
      var url = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&q=http://feeds.feedburner.com/fmylife';

      request(url, function (error, data, body) {
        body = JSON.parse(body);

        var fmls = body.responseData.feed.entries;
        var randomFml = fmls[Math.floor(Math.random()*fmls.length)];
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
        body = JSON.parse(body);

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

        request(real, function (error, response, body) {
          body = JSON.parse(body);
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