'use strict';

var request = require('request');
var Q       = require('q');

/**
 * Displays the help text
 * @param  {obj} channel - channel object
 */
function showHelp (channel) {
  var text = [
    '```Användning:',
    '@iteam [alternativ]\n',
    'Alternativ:',
    '9gag               slumpa en bild från 9gags hot-lista',
    'fml                slumpa en FML från fmylife.com',
    'help/hjälp         visar denna hjälp',
    'np                 visar vilken låt som spelas',
    'np {användarnamn}  visar vilken låt du spelar (Last.fm-användarnamn)',
    'sl                 visar närmaste avgångarna från Rådmansgatan',
    'sl {station}       visar närmaste avgångarna från angiven station```'
  ];

  channel.send(text.join('\n'));
}

/**
 * Returns a random object from an array
 * @param  {array} array - Array
 * @return {obj, string} - Returns random from array
 */
function returnRandom (array) {
  return array[ Math.floor( Math.random() * array.length ) ];
}

/**
 * Get data from a given URL
 * @param  {string} url - URL to get data from
 * @return {obj} - Promise
 */
function getDataFromURL (url) {
  var deferred = Q.defer();

  request(url, function (error, response, body) {
    if (error) {
      deferred.reject(error);
    }

    if (body) {
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      deferred.resolve(body);
    }
  });

  return deferred.promise;
}

function calculateTimeFromMinutes (minutes) {
  if (minutes < 60) {
    return minutes > 1 ? minutes + ' minuter' : minutes + ' minut';
  } else if (minutes === 60) {
    return '1 timme';
  } else if (minutes > 60) {
    var hours = Math.floor(minutes / 60);
    var minutes = Math.floor(minutes / 60 % 1 * 60);
    minutes = minutes === 1 ? minutes + ' minut' : minutes + ' minuter';
    return hours === 1 ? hours + ' timme ' + minutes : hours + ' timmar ' + minutes;
  }
}


module.exports = {
  showHelp: showHelp,
  returnRandom: returnRandom,
  getDataFromURL: getDataFromURL,
  calculateTimeFromMinutes: calculateTimeFromMinutes
};