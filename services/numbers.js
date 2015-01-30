'use strict';

var q     = require('q');
var jsdom = require('jsdom');

exports.get = function (commands) {
  var deferred = q.defer();
  var url      = 'http://numbersapi.com/{number}/{type}';

  if (commands[1] && commands[1].indexOf('/') > -1) {
    url = url.replace('{number}', commands[1].split('/').reverse().join('/'));
    url = url.replace('{type}', 'date');
  }

  url = commands[1] ? url.replace('{number}', commands[1]) : url.replace('{number}', 'random');

  url = commands[2] ? url.replace('{type}', commands[2]) : url.replace('{type}', '');

  jsdom.env(
    url,
    function (errors, window) {
      if (window) {
        deferred.resolve(window.document.body.textContent);

        window.close();
      }
    }
  );

  return deferred.promise;
};