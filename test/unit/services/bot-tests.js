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

  beforeEach(function () {
    lastfm = {
      getLastfm: sinon.spy()
    };

    request = sinon.stub();

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
    });

    describe('#help', function() {
      it('should be a function', function() {
        expect(bot.service().help).to.be.a('function');
      });
    });

    describe('#hjälp', function() {
      it('should be a function', function() {
        expect(bot.service().hjälp).to.be.a('function');
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