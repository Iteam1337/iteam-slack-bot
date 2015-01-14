var chai       = require('chai');
var expect     = chai.expect;
var sinon      = require('sinon');
var proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('#BotService', function() {
  var bot;
  var lastfm;
  var request;
  var slack;
  var channel;

  beforeEach(function () {
    lastfm = {
      getLastfm: sinon.spy()
    };

    request = sinon.stub();

    channel = {
      send: sinon.spy()
    };

    bot = proxyquire(process.cwd() + '/services/bot', {
      'request': request,
      './lastfm': lastfm
    });
  });

  describe('/Service', function() {
    it('should be a function', function() {
      expect(bot.service).to.be.a('function');
    });

    it('should return a object', function() {
      expect(bot.service()).to.be.an('object');
    });

    describe('#fml', function() {
      it('should be a function', function() {
        expect(bot.service().fml).to.be.a('function');
      });

      xit('should call request with correct url', function() {
        var url = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&q=http://feeds.feedburner.com/fmylife';
          
        bot.service().fml('fml', {});

        expect(request).calledOnce.and.calledWith(url);
      });
    });

    describe('#help', function() {
      it('should be a function', function() {
        expect(bot.service().help).to.be.a('function');
      });

      it('should call showHelp', function() {
        bot.service().help('help', channel);

        expect(channel.send).calledOnce;
      });
    });

    describe('#hjälp', function() {
      it('should be a function', function() {
        expect(bot.service().hjälp).to.be.a('function');
      });

      it('should call showHelp', function() {
        bot.service().help('help', channel);

        expect(channel.send).calledOnce;
      });
    });

    describe('#np', function() {
      it('should be a function', function() {
        expect(bot.service().np).to.be.a('function');
      });
    });

    describe('#sl', function() {
      it('should be a function', function() {
        expect(bot.service().sl).to.be.a('function');
      });
    });
  });
});