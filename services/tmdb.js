'use strict';

var mdb   = require('moviedb')(process.env.TMDB_KEY);
var q     = require('q');
var utils = require('../utilities/utils');

function movie (data) {
  var genre = data.genres.length ? data.genres[0].name + ' - ' : '';
  var date = data.release_date ? data.release_date.substr(0,4) + ' - ' : ''
  var runtime = data.runtime ? utils.calculateTimeFromMinutes(data.runtime) : '';

  return '*' + data.title + '*\n_' + genre + date + runtime  + '_\n' + data.overview;
}

exports.get = function (commands) {
  var deferred = q.defer();

  if (commands.length === 1) {
    deferred.resolve('Send an IMDb ID, movie title or IMDb URL');
  }

  var isId = commands[1].match(/tt\d{7}/);

  if (isId) {
    var id = isId[0];

    mdb.movieInfo({ id: id }, function (error, response) {
      deferred.resolve(movie(response));
    });
  } else {
    mdb.searchMovie({ query: commands[1] }, function (error, response) {
      var id = response.results[0].id;

      mdb.movieInfo({ id: id }, function (errorInfo, responseInfo) {
        deferred.resolve(movie(responseInfo));
      });
    });
  }

  return deferred.promise;
};