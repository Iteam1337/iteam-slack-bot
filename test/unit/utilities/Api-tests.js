var chai       = require('chai');
var expect     = chai.expect;
var sinon      = require('sinon');
var proxyquire = require('proxyquire');
var q = require('q');

chai.use(require('sinon-chai'));

describe('/Api', function() {
  var request;
  var Api;

  beforeEach(function () {
    var deferred = q.defer();

    request = sinon.spy();

    Api = proxyquire(process.cwd() + '/utilities/Api', {
      'request': request
    });
  });

  describe('#core', function() {
    it('should be a function', function() {
      expect(Api.core).to.be.a('function');
    });
  });

  describe('#get', function() {
    it('should be a function', function() {     
      expect(Api.get).to.be.a('function');
    });

    it('should call core functionality with url', function() {
      Api.core = sinon.spy();
      
      Api.get('http://facebook.com');

      expect(Api.core).calledWith('get', 'http://facebook.com', '');
    });
  });

});