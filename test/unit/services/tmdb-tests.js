require('dotenv').config();

var chai       = require('chai');
var expect     = chai.expect;
var sinon      = require('sinon');
var proxyquire = require('proxyquire');
var q = require('q');

chai.use(require('sinon-chai'));

describe('/TmdbService', function() {
  var deferred;
  var mdb;

  beforeEach(function () {
    deferred = q.defer();

    mdb = sinon.stub().returns({
      movieInfo: sinon.spy(),
      searchMovie: sinon.spy()
    });

    service = proxyquire(process.cwd() + '/services/tmdb', {
      'moviedb': mdb
    });
  });

  describe('#get', function() {
    it('should be a function', function() {
      expect(service.get).to.be.a('function');
    });

    it('should only call movieInfo if sent a IMDb ID', function() {
      service.get(['movie', 'tt1234567']);

      expect(mdb().movieInfo).calledOnce.and.calledWith({ id: 'tt1234567' });
    });

    it('should call searchMovie if sent a title', function() {
      service.get(['movie', 'Requiem for a Dream']);

      expect(mdb().searchMovie).calledOnce.and.calledWith({ query: 'Requiem for a Dream' });
    });
  });

});
