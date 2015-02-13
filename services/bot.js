'use strict';

var LastFm  = require('./lastfm');
var Flip    = require('./flip');
var tmdb    = require('./tmdb');
var error   = require('./error');
var country = require('./country');
var Numbers = require('./numbers');
var chuck   = require('./chuck');
var SL      = require('./sl');
var utils   = require('../utilities/utils');
var jsdom   = require('jsdom');

function sendToChannel (channel, text) {
  channel.send(text.toString());
}

/**
 * Used as params for all calls.
 * All services don't need all of them.
 * 
 * @param  {array} commands - Array of commands
 * @param  {object} channel - Channel object
 * @param  {string} user - User ID
 * @param  {object} slack - Slack
 */
exports.service = function () {
  return {
    // Display a random image from 9gag's hot list
    '9gag': function (commands, channel) {
      var url = 'http://infinigag.eu01.aws.af.cm/hot/0';

      utils.getDataFromURL(url)
        .then(function (data) {
          if (data && data.data) {
            var randomGag = utils.returnRandom(data.data);

            channel.send(randomGag.caption + '\n' + randomGag.images.large);
          }
        })
        .catch(function (error) {
          error.log('9gag - ' + error);
        });
    },

    // Beer from BreweryDb
    beer: function (commands, channel) {
      var beerKey = process.env.BEER_KEY;
      var url = 'http://api.brewerydb.com/v2/search?q={q}&key={key}&type=beer';

      url = url.replace('{key}', beerKey).replace('{q}', commands[1]);

      if (!beerKey) {
        error.log('No API key for BreweryDb');
        return;
      }
      
      utils.getDataFromURL(url)
        .then(function (beers) {
          var beer = beers.data[0];
          var desc = beer.description || '';
          var abv = beer.abv ? ' - ' + beer.abv + '%' : '';
          var glass = beer.glass ? ' - ' + beer.glass.name : '';

          channel.send('*' + beer.name + '*\n_' + beer.style.name + abv + glass + '_\n' + desc);
        })
        .catch(function (error) {
          error.log('Beer - ' + error);
        })
    },

    chuck: function (commands, channel) {
      chuck
        .get()
        .then(function (response) {
          channel.send(response);
        });
    },

    country: function (commands, channel) {
      country
        .get(commands)
        .then(function (data) {
          sendToChannel(channel, data);
        });
    },

    // Excuse
    excuse: function (commands, channel) {
      var excuses = {
        programmer: {
          url: 'http://programmingexcuses.com/',
          selector: '.wrapper a'
        },
        developer: {
          url: 'http://developerexcuses.com/',
          selector: '.wrapper a'
        }
      };

      var excuse = commands[1] && excuses[commands[1]] ? excuses[commands[1]] : utils.randomProperty(excuses);

      jsdom.env(
        excuse.url,
        function (errors, window) {
          if (window) {
            channel.send(window.document.querySelector(excuse.selector).textContent);

            window.close();
          }
        }
      );
    },

    // Flip
    flip: function (commands, channel, user, slack) {
      var flip = Flip.doFlip(commands, user, slack);
      channel.send(flip);
    },

    // A random FML from fmylife.com
    fml: function (commands, channel) {
      var url = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&q=http://feeds.feedburner.com/fmylife';

      utils.getDataFromURL(url)
        .then(function (fmls) {
          var randomFml = utils.returnRandom(fmls.responseData.feed.entries);
          var fml = randomFml.content.replace(/(<([^>]+)>)/ig,"") + '\n- _' + randomFml.author + '_';

          channel.send(fml);
        })
        .catch(function (error) {
          error.log('FML - ' + error);
        });
    },

    // Help
    help: function (commands, channel) {
      utils.showHelp(channel)
    },

    // A little hello message with the users real name
    hej: function (commands, channel, user, slack) {
      user = slack.getUserByID(user);

      channel.send('Hej, ' + user.profile.first_name + '!');
    },

    // Help
    hjälp: function (commands, channel) {
      utils.showHelp(channel)
    },

    movie: function (commands, channel) {
      tmdb
        .get(commands)
        .then(function (response) {
          channel.send(response);
        });
    },

    // Display now playing
    np: function (commands, channel) {
      LastFm
        .getLastfm(commands)
        .then(function (data) {
          channel.send(data);
        });
    },

    number: function (commands, channel) {
      Numbers
        .get(commands)
        .then(function (response) { 
          channel.send(response);
        });
    },

    // Rage flip
    rage: function (commands, channel, user, slack) {
      var rage = Flip.doFlip(commands, user, slack);
      channel.send(rage);
    },

    // SL departure times
    sl: function (commands, channel) {
      if (commands.length > 2) {
        SL.reseplaneraren(commands, channel);
      } else {
        SL.realtidsinformation(commands, channel);
      }
    },

    // Unflip
    unflip: function (commands, channel, user, slack) {
      var unflip = Flip.doFlip(commands, user, slack);
      channel.send(unflip);
    }
  }
};