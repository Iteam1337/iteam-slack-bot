'use strict';

var request = require('request');
var Q       = require('q');

var user = process.env.CHATGANG ? '@bob' : '@iteam';

/**
 * Displays the help text
 * @param  {obj} channel - channel object
 */
function showHelp (channel) {
  var text = [
    '```Användning:',
    user + ' [alternativ]\n',
    'Alternativ:',
    '9gag                       slumpa en bild från 9gags hot-lista',
    'beer [namn]                namn på öl (obligatorisk)',
    'excuse {typ}               developer/programmer. Default: slumpvald',
    'flip me/{namn}             släng dig själv eller något annat',
    'fml                        slumpa en FML från fmylife.com',
    'help/hjälp                 visar denna hjälp',
    'movie [titel]              titel kan vara namn, IMDb ID eller IMDb URL',
    'np {användarnamn}          visar vilken låt du spelar (Last.fm-användarnamn). Default: iteam1337',
    'number {nummer} {typ}      nummer kan vara ett tal eller ett datum (dd/mm). Default: random. Typ kan vara trivia, year, date eller math. Default: trivia för tal, date för ett datum.',
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
  calculateTimeFromMinutes: calculateTimeFromMinutes
};