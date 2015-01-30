var chai       = require('chai');
var expect     = chai.expect;
var sinon      = require('sinon');
var proxyquire = require('proxyquire');
var q = require('q');

chai.use(require('sinon-chai'));

describe('/NumbersService', function() {
  var jsdom;
  var deferred;

  beforeEach(function () {
    deferred = q.defer();

    jsdom = {
      env: sinon.spy()
    };

    service = proxyquire(process.cwd() + '/services/numbers', {
      'jsdom': jsdom
    });
  });

  describe('#get', function() {
    it('should call jsdom with url for random number', function() {
      service.get(['number']);

      expect(jsdom.env).calledOnce.and.calledWith('http://numbersapi.com/random/');
    });

    it('should call jsdom with url for specific number', function() {
      service.get(['number', '42']);

      expect(jsdom.env).calledOnce.and.calledWith('http://numbersapi.com/42/');        
    });

    it('should call jsdom with url for specific type and number', function() {
      service.get(['number', '42', 'math']);

      expect(jsdom.env).calledOnce.and.calledWith('http://numbersapi.com/42/math');        
    });

    it('should call jsdom with url for a date', function() {
      service.get(['number', '4/2']);

      expect(jsdom.env).calledOnce.and.calledWith('http://numbersapi.com/2/4/date');        
    });
  });
});

