var chai       = require('chai');
var expect     = chai.expect;
var sinon      = require('sinon');
var proxyquire = require('proxyquire');
var q = require('q');

chai.use(require('sinon-chai'));

describe('/BotService', function() {
  var bot;
  var flip;
  var lastfm;
  var request;
  var jsdom;
  var slack;
  var channel;
  var utils;
  var error;
  var deferred;

  beforeEach(function () {
    deferred = q.defer();
    apiDeferred = q.defer();

    lastfm = {
      getLastfm: sinon.stub().returns(deferred.promise)
    };

    flip = { 
      doFlip: sinon.stub().returns('flippy')
    };

    request = sinon.stub();

    channel = {
      send: sinon.spy()
    };

    jsdom = {
      env: sinon.spy()
    };

    Api = {
      get: sinon.stub().returns(apiDeferred.promise),
    }

    utils = {
      showHelp: sinon.spy()
    };

    error = {
      log: sinon.spy()
    };

    bot = proxyquire(process.cwd() + '/services/bot', {
      'request': request,
      'jsdom': jsdom,
      './lastfm': lastfm,
      './flip': flip,
      '../utilities/utils': utils,
      '../utilities/Api': Api,
      './error': error
    });
  });

  describe('#Service', function() {
    it('should be a function', function() {
      expect(bot.service).to.be.a('function');
    });

    it('should return a object', function() {
      expect(bot.service()).to.be.an('object');
    });

    describe('9gag', function() {
      it('should be a function', function() {
        expect(bot.service()['9gag']).to.be.a('function');
      });

      it('should call API with correct url', function() {
        bot.service()['9gag'](['9gag'], channel);

        expect(Api.get).calledOnce.and.calledWith('http://infinigag.eu01.aws.af.cm/hot/0');
      });
    });

    describe('#beer', function() {
      it('should be a function', function() {
        expect(bot.service().beer).to.be.a('function');
      });

      it('should log an error if no API key is set', function() {
        bot.service().beer(['beer', 'Camden+IPA'], channel);

        if (!process.env.BEER_KEY) {
          expect(error.log).calledOnce.and.calledWith('No API key for BreweryDb');
        }
      });

      it('should get data from BreweryDb API', function() {
        bot.service().beer(['beer', 'Camden+IPA'], channel);

        var url = 'http://api.brewerydb.com/v2/search?q={q}&key={key}&type=beer';
        
        expect(Api.get).calledOnce.and.calledWith(url.replace('{key}', process.env.BEER_KEY).replace('{q}', 'Camden+IPA'));
      });
    });

    describe('#flip', function() {
      it('should be a function', function() {
        expect(bot.service().flip).to.be.a('function');
      });

      it('should send a call to flip service', function() {
        bot.service().flip(['flip'], channel, 'test', {});

        expect(flip.doFlip).calledOnce.and.calledWith(
          ['flip'],
          'test',
          {}
          );
      });

      it('should send flip message to channel', function() {
       bot.service().flip(['flip'], channel, 'test', {});

        expect(channel.send).calledOnce.and.calledWith('flippy');       
      });
    });

    describe('#fml', function() {
      it('should be a function', function() {
        expect(bot.service().fml).to.be.a('function');
      });

      it('should call request with correct url', function() {
        var url = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&q=http://feeds.feedburner.com/fmylife';
          
        bot.service().fml('fml', {});

        expect(Api.get).calledOnce.and.calledWith(url);
      });
    });

    describe('#help', function() {
      it('should be a function', function() {
        expect(bot.service().help).to.be.a('function');
      });

      it('should call showHelp', function() {
        bot.service().help('help', channel);

        expect(utils.showHelp).calledOnce.and.calledWith(channel);
      });
    });

    describe('#hjälp', function() {
      it('should be a function', function() {
        expect(bot.service().hjälp).to.be.a('function');
      });

      it('should call showHelp', function() {
        bot.service().help('help', channel);

        expect(utils.showHelp).calledOnce.and.calledWith(channel);
      });
    });

    describe('#np', function() {
      it('should be a function', function() {
        expect(bot.service().np).to.be.a('function');
      });

      it('should call to get LastFm', function() {
        bot.service().np(['np', 'hpbeliever']);

        expect(lastfm.getLastfm).calledOnce.and.calledWith(['np', 'hpbeliever']);
      });
    });

    describe('#number', function() {
      it('should be a function', function() {
        expect(bot.service().number).to.be.a('function');
      });
    });

    describe('#rage', function() {
      it('should be a function', function() {
        expect(bot.service().rage).to.be.a('function');
      });

      it('should send a call to flip service', function() {
        bot.service().rage(['rage'], channel, 'test', {});

        expect(flip.doFlip).calledOnce.and.calledWith(
          ['rage'],
          'test',
          {}
          );
      });

      it('should send flip message to channel', function() {
       bot.service().rage(['rage'], channel, 'test', {});

        expect(channel.send).calledOnce.and.calledWith('flippy');       
      });
    });

    describe('#sl', function() {
      it('should be a function', function() {
        expect(bot.service().sl).to.be.a('function');
      });
    });

    describe('#unflip', function() {
      it('should be a function', function() {
        expect(bot.service().unflip).to.be.a('function');
      });

      it('should send a call to flip service', function() {
        bot.service().unflip(['unflip'], channel, 'test', {});

        expect(flip.doFlip).calledOnce.and.calledWith(
          ['unflip'],
          'test',
          {}
          );
      });

      it('should send flip message to channel', function() {
       bot.service().unflip(['unflip'], channel, 'test', {});

        expect(channel.send).calledOnce.and.calledWith('flippy');       
      });
    });
  });
});