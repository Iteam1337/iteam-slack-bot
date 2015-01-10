var LastFm = require('./lastfm');

exports.service = function () {
  return {
    np: function (text, channel) {
      LastFm
        .getLastfm(text)
        .then(function (data) {
          channel.send(data);
        });
    }
  }
};