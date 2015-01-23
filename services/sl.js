'use strict';

var utils  = require('../utilities/utils');

var baseUrl  = 'http://api.sl.se/api2/';
var keyPlats = process.env.SL_PLATS;
var keyReal  = process.env.SL_REAL;
var keyRese  = process.env.SL_RESE;

/**
 * Takes two station names and calculates a trip between them
 * @param commands
 * @param channel
 */
function reseplaneraren (commands, channel) {
  var rese = baseUrl + 'TravelplannerV2/trip.json?key={key}&originId={origin}&destId={destination}';
  rese = rese.replace('{key}', keyRese);
  rese = rese.replace('{origin}', commands[1]);
  rese = rese.replace('{destination}', commands[2]);

  var trip = [];

  utils.getDataFromURL(rese)
    .then(function (body) {
      var firstTrip = body.TripList.Trip[0];

      if (firstTrip.LegList.Leg.length) {
        firstTrip.LegList.Leg.forEach(function (leg) {
          if (!leg.hide) {
            trip.push(leg.Origin.time + ' ' + leg.Origin.name + ' (' + leg.name + ')\n|');
            trip.push(leg.Destination.time + ' ' + leg.Destination.name + '\n');
          }
        });
      } else {
        var leg = firstTrip.LegList.Leg;
        trip.push(leg.Origin.time + ' ' + leg.Origin.name + ' (' + leg.name + ')\n|');
        trip.push(leg.Destination.time + ' ' + leg.Destination.name + '\n');
      }

      trip.push('*Total restid: ' + utils.calculateTimeFromMinutes(firstTrip.dur) + '*');

      channel.send(trip.join('\n'));
    });
}

/**
 * Takes one station and shows upcoming departures
 * @param commands
 * @param channel
 */
function realtidsinformation (commands, channel) {
  var plats = baseUrl + 'typeahead.json?key={key}&searchstring={search}&stationsonly=true&maxresults=1';
  var real = baseUrl + 'realtimedepartures.json?key={key}&siteid={id}';

  var station = commands[1] ? commands[1] : 'Rådmansgatan';
  plats = plats.replace('{key}', keyPlats).replace('{search}', station);

  utils.getDataFromURL(plats)
    .then(function (body) {
      if (body.StatusCode !== 0) {
        channel.send('Något gick snett');
        return;
      }

      if (!body.ResponseData[0]) {
        channel.send('Kan inte hitta någon station med namnet *' + station);
        return;
      }

      var name = body.ResponseData[0].Name;
      var id = body.ResponseData[0].SiteId;

      real = real.replace('{key}', keyReal).replace('{id}', id);

      utils.getDataFromURL(real)
        .then(function (body) {

          var metros = body.ResponseData.Metros;
          var departures = [];

          metros.forEach(function (metro) {
            departures.push('*' + metro.LineNumber + ' ' + metro.Destination + '*\n' + metro.DisplayTime);
          });

          channel.send('*' + name + '*\n' + departures.join('\n'));
        });
    });
}

module.exports = {
  reseplaneraren: reseplaneraren,
  realtidsinformation: realtidsinformation
};