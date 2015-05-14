var chai       = require('chai');
var expect     = chai.expect;
var sinon      = require('sinon');
var proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('/FlipService', function() {
  var flip;
  var slack;
  var fliptext;

  beforeEach(function () {
    slack = {
      getUserByID: sinon.stub().returns({
        profile: {
          'first_name': 'Rickard'
        }
      })
    };

    // Flip mock
    flipTextMock = sinon.stub();

    flipTextMock.withArgs('iteam').returns('maeti');
    flipTextMock.withArgs('rickard').returns('drakcir');
    flipTextMock.withArgs('laurin').returns('nirual');

    flip = proxyquire(process.cwd() + '/services/flip', {
      'flip-text': flipTextMock
    });
  });

  describe('#doFlip', function() {
    it('should be a function', function() {
      expect(flip.doFlip).to.be.a('function');
    });

    it('should get the users information', function() {
      flip.doFlip(['flip'], 'test', slack);

      expect(slack.getUserByID).calledOnce.and.calledWith('test');
    });

    it('should call flip-text module to flip provided text', function() {
      flip.doFlip(['flip', 'iteam'], 'test', slack);

      expect(flipTextMock).calledOnce.and.calledWith('iteam');
    });

    it('should call flip-text module to flip me', function() {
      flip.doFlip(['flip', 'me'], 'test', slack);

      expect(flipTextMock).calledOnce.and.calledWith('rickard');
    });

    describe('flip', function() {
      it('should return a flip with table if no value is provided', function() {
        expect(flip.doFlip(['flip'], 'test', slack)).to.eql('(╯°□°）╯︵ ┻━┻');
      });

      it('should return a flip for a provided value', function() {
        expect(flip.doFlip(['flip', 'iteam'], 'test', slack)).to.eql('(╯°□°）╯︵ maeti');
      });

      it('should return a flip for me', function() {
        expect(flip.doFlip(['flip', 'me'], 'test', slack)).to.eql('(╯°□°）╯︵ drakcir');
      });

      it('should return a flip with commands separated', function() {
        expect(flip.doFlip(['flip', 'rickard+laurin'], 'test', slack)).to.eql('(╯°□°）╯︵ nirual drakcir');
      });

      it('should flip with lower case', function() {
        expect(flip.doFlip(['flip', 'RiCKaRd'], 'test', slack)).to.eql('(╯°□°）╯︵ drakcir');
      });
    });


    describe('rage', function() {
      it('should return a rage with table if no value is provided', function() {
        expect(flip.doFlip(['rage'], 'test', slack)).to.eql('(ノಠ益ಠ)ノ彡 ┻━┻');
      });

      it('should return a rage for a provided value', function() {
        expect(flip.doFlip(['rage', 'iteam'], 'test', slack)).to.eql('(ノಠ益ಠ)ノ彡 maeti');
      });

      it('should return a rage for me', function() {
        expect(flip.doFlip(['rage', 'me'], 'test', slack)).to.eql('(ノಠ益ಠ)ノ彡 drakcir');
      });
    });

    describe('unflip', function() {
      it('should return an unflip with table if no value is provided', function() {
        expect(flip.doFlip(['unflip'], 'test', slack)).to.eql('┻━┻ ノ( º _ ºノ)');
      });

      it('should return an unflip for a provided value', function() {
        expect(flip.doFlip(['unflip', 'iteam'], 'test', slack)).to.eql('iteam ノ( º _ ºノ)');
      });

      it('should return an unflip for me', function() {
        expect(flip.doFlip(['unflip', 'me'], 'test', slack)).to.eql('rickard ノ( º _ ºノ)');
      });
    });

  });

});