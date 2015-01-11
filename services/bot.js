var LastFm = require('./lastfm');

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