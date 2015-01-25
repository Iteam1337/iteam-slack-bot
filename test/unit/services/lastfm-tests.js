var chai       = require('chai');
var expect     = chai.expect;
var sinon      = require('sinon');
var proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('/LastFmService', function() {
  var LastFmApiMock;
  var q;

  beforeEach(function () {
    LastFmApiMock = sinon.stub().returns({
      user: {
        getRecentTracks: sinon.spy()
      }
    });

    q = {
      defer: sinon.stub().returns({
        promise: {},
        resolve: {}
      })
    };

    error = {
      log: sinon.spy()
    };

    lastfm = proxyquire(process.cwd() + '/services/lastfm', {
      'q': q,
      'lastfmapi': LastFmApiMock,
    });
  });

  describe('#getLastfm', function() {
    it('should be a function', function() {
      expect(lastfm.getLastfm).to.be.a('function');
    });

    it('should call setup of q', function() {
      lastfm.getLastfm(['np', 'hpbeliever']);

      expect(q.defer).calledOnce;
    });

    it('should call LastFm API module with correct information', function() {
      lastfm.getLastfm(['np', 'hpbeliever']);

      expect(LastFmApiMock().user.getRecentTracks).calledOnce.and.calledWith({
        user: 'hpbeliever',
        limit: 1
      });
    });

    it('should call LastFm API with iteam1337 if no username if provided', function() {
      lastfm.getLastfm(['np']);
      
      expect(LastFmApiMock().user.getRecentTracks).calledOnce.and.calledWith({
        user: 'iteam1337',
        limit: 1
      });
    });
  });
});
