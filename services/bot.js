'use strict';

var LastFm  = require('./lastfm');
var request = require('request');

function showHelp (channel) {
  var text = [
    '*Användning:*',
    '@iteam [alternativ]',
    '*Alternativ:*',
    '_help/hjälp_\t\t\t\t\tvisar denna hjälp',
    '_np_\t\t\t\t\t\t\t\tvisar vilken låt som spelas',
    '_np:{användarnamn}_\tvisar vilken låt du spelar (Last.fm-användarnamn)'
  ];

  channel.send(text.join('\n'));
}

exports.service = function () {
  return {
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
     * Show help
     * @param  {[type]} text    [description]
     * @param  {[type]} channel [description]
     * @return {[type]}         [description]
     */
    help: function (text, channel) {
      showHelp(channel)
    },
    /**
     * Show help
     * @param  {[type]} text    [description]
     * @param  {[type]} channel [description]
     * @return {[type]}         [description]
     */
    hjälp: function (text, channel) {
      showHelp(channel)
    },
    /**
     * Show now playing
     * @param  {[type]} text    [description]
     * @param  {[type]} channel [description]
     * @return {[type]}         [description]
     */
    np: function (text, channel) {
      LastFm
        .getLastfm(text)
        .then(function (data) {
          channel.send(data);
        });
    }
  }
};