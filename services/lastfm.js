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
exports.prepareResponse = function (lastfm) {
  var track      = lastfm.track[0] || lastfm.track;
  var user       = lastfm["@attr"].user;
  var whenPlayed = lastfm.track.artist ? '*Last played:* ' : '';
  var sendUser   = (user !== 'iteam1337') ? ' (_' + user + '_)' : '';

  return whenPlayed + track.artist['#text'] + ' - ' + track.name + sendUser;
};

/**
 * Prepare request URL
 * Should call with iteam1337 if no user name is provided
 * 
 * @param  {obj} body - Request body from POST
 * @return {string} - URL for Last.fm request
 */
exports.prepareUser = function (text) {
  var user = text.split(':')[1] ? text.split(':')[1].trim().split(' ')[0] : 'iteam1337';
  return user;
};

/**
 * Send request with correct username to Last.fm
 * @param  {text} text - Message from Slack
 * @return {obj}       - Promise
 */
exports.getLastfm = function (text) {
  var deferred = Q.defer();

  // Last.fm params
  var lastfm = {
    user: exports.prepareUser(text),
    limit: 1
  };

  lfm.user.getRecentTracks(lastfm, function (error, tracks) {
    if (!error) {
      var text = exports.prepareResponse(tracks);
      deferred.resolve(text);
    }
  });

  return deferred.promise;
};
