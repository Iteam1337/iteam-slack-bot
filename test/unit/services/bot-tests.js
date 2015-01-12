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
  });
});