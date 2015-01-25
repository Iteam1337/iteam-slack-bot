var chai       = require('chai');
var expect     = chai.expect;
var sinon      = require('sinon');
var proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('/ErrorService', function() {
  var error;
  var channel;

  beforeEach(function () {
    channel = {
      send: sinon.spy()
    };

    error = proxyquire(process.cwd() + '/services/error', {});
  });

  describe('#log', function() {
    it('should be a function', function() {
      expect(error.log).to.be.a('function');
    });

    it('should call channel with empty message', function () {
      error.log('test', channel);

      expect(channel.send).calledOnce.and.calledWith('');
    });
  });
});
