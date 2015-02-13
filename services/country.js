'use strict';

var request = require('request');
var q = require('q');

function getLanguage (language) {
  language = language.toLowerCase();

  var languages = {
    'japanese': 'ja',
    'german': 'de',
    'spanish': 'es',
    'french': 'fr',
    'italian': 'it'
  };

  return languages[language] ? languages[language] : '';
}

function addUnit (type) {
  var types = {
    area: 'km²',
    population: 'människor'
  };


  type = types[type] ? types[type] : '';

  return ' ' + type;
}

function splitNumber (number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

exports.get = function (commands) {
  var deferred = q.defer();
  var country;
  var type;
  var language;

  if (commands[1] === 'translate') {
    type = 'translate';
    country = commands[2];
    language = getLanguage(commands[4]);
  } else {
    if (commands[2] === 'of') {
      country = commands[3];
      type = commands[1];
    } else {
      country = commands[2];
      type = commands[1];
    }
  }

  var url = 'http://restcountries.eu/rest/v1/name/' + country;

  request(url, function (error, response, body) {
    body = JSON.parse(body);
    var value;

    if (type === 'translate') {
      value = body[0].translations[language];
    } else {
      value = splitNumber(body[0][type]) + addUnit(type);
    }

    deferred.resolve(value);
  });

  return deferred.promise;
};