'use strict';

// Deps
var Q         = require('q');
var LastfmAPI = require('lastfmapi');

// Connect to Last.fm
var lfm = new LastfmAPI({
  'api_key': process.env.LASTFM_KEY,
  'secret': process.env.LASTFM_SECRET
});

/**
 * Prepare response object
 * @param  {string} body - Last.fm API data
 * @return {obj} - Response object prepared for Slack
 */
function prepareResponse (lastfm) {
  var track      = lastfm.track[0] || lastfm.track;
  var user       = lastfm["@attr"].user;
  var whenPlayed = lastfm.track.artist ? '*Last played:* ' : '';
  var sendUser   = (user !== 'iteam1337') ? ' (_' + user + '_)' : '';

  return whenPlayed + track.artist['#text'] + ' - ' + track.name + sendUser;
}

/**
 * Send request with correct username to Last.fm
 * @param  {text} text - Message from Slack
 * @return {obj}       - Promise
 */
exports.getLastfm = function (commands) {
  var deferred = Q.defer();

  // Last.fm params
  var lastfm = {
    user: commands[1] || 'iteam1337',
    limit: 1
  };

  // Send Last.fm call
  lfm.user.getRecentTracks(lastfm, function (error, tracks) {
    if (!error) {
      var text = prepareResponse(tracks);
      deferred.resolve(text);
    }
  });

  return deferred.promise;
};
