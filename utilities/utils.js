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
    '9gag                       slumpa en bild från 9gags hot-lista',
    'beer [namn]                namn på öl (obligatorisk)',
    'excuse {typ}               developer/programmer. Default: slumpvald',
    'flip me/{namn}             släng dig själv eller något annat',
    'fml                        slumpa en FML från fmylife.com',
    'help/hjälp                 visar denna hjälp',
    'np {användarnamn}          visar vilken låt du spelar (Last.fm-användarnamn). Default: iteam1337',
    'rage me/{namn}             rage:a på dig själv eller något annat',
    'sl {station}               visar närmaste avgångarna från angiven station. Default: Rådmansgatan',
    'sl {station-a} {station-b} visar närmast i tid resa mellan a och b',
    'unflip me/{namn}           ställ tillbaka dig själv eller något annat```'
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
 * Return a random property from an object
 * @param  {object} object - Object
 * @return {object, string} - Random property from object
 */
function randomProperty (object) {
  var keys = Object.keys(object)
  return object[keys[ keys.length * Math.random() << 0]];
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
      if (typeof body === 'string' && body.indexOf('<') === -1) {
        body = JSON.parse(body);
      }

      deferred.resolve(body);
    }
  });

  return deferred.promise;
}

/**
 * Takes minutes and returns a more readable string
 * @param minutes
 * @returns {string} - Humanized string
 */
function calculateTimeFromMinutes (minutes) {
  if (minutes < 60) {
    return minutes > 1 ? minutes + ' minuter' : minutes + ' minut';
  } else if (minutes === 60) {
    return '1 timme';
  } else if (minutes > 60) {
    var hours = Math.floor(minutes / 60);
    var minutes = Math.round(minutes / 60 % 1 * 60);
    minutes = minutes === 1 ? minutes + ' minut' : minutes + ' minuter';
    return hours === 1 ? hours + ' timme ' + minutes : hours + ' timmar ' + minutes;
  }
}

module.exports = {
  showHelp: showHelp,
  returnRandom: returnRandom,
  randomProperty: randomProperty,
  getDataFromURL: getDataFromURL,
  calculateTimeFromMinutes: calculateTimeFromMinutes
};