var request = require('request');
var q = require('q');

var Api = {
  core: function (type, url, data) {
    var deferred = q.defer();

    request(url, function (error, res, body) {
      body = JSON.parse(body);
      deferred.resolve(body);
    });

    return deferred.promise;
  },
  get: function (url) {
    return this.core('get', url, '');
  }
};

module.exports = Api;