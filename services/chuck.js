'use strict';

var request = require('request');
var q = require('q');

exports.get = function () {
  var deferred = q.defer();

  request('http://api.icndb.com/jokes/random', function (error, res, body) {
    body = JSON.parse(body);

    deferred.resolve(body.value.joke);
  });

  return deferred.promise;
};