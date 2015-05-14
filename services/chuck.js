'use strict';

var Api = require('../utilities/Api');

exports.get = function () {
  return Api.get('http://api.icndb.com/jokes/random');
};