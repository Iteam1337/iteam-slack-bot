var chai       = require('chai');
var expect     = chai.expect;
var sinon      = require('sinon');
var proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('/Utilities', function() {
  var utils;
  var q;
  var request;
  var slack;
  var channel;

  beforeEach(function () {
    q = sinon.spy();

    request = sinon.spy();

    channel = {
      send: sinon.spy()
    };

    utils = proxyquire(process.cwd() + '/utilities/utils', {
      'q': q,
      'request': request
    });
  });

  describe('#showHelp', function() {
    it('should be a function', function() {
      expect(utils.showHelp).to.be.a('function');
    });

    it('should call channel.send with a string', function() {
      utils.showHelp(channel);

      var text = [
        '```Användning:',
        '@iteam [alternativ]\n',
        'Alternativ:',
        '9gag                       slumpa en bild från 9gags hot-lista',
        'beer [namn]                namn på öl (obligatorisk)',
        'excuse {typ}               developer/programmer. Default: slumpvald',
        'flip me/{namn}             släng dig själv eller något annat',
        'fml                        slumpa en FML från fmylife.com',
        'help/hjälp                 visar denna hjälp',
        'movie [titel]              titel kan vara namn, IMDb ID eller IMDb URL',
        'np {användarnamn}          visar vilken låt du spelar (Last.fm-användarnamn). Default: iteam1337',
        'number {nummer} {typ}      nummer kan vara ett tal eller ett datum (dd/mm). Default: random. Typ kan vara trivia, year, date eller math. Default: trivia för tal, date för ett datum.',
        'rage me/{namn}             rage:a på dig själv eller något annat',
        'sl {station}               visar närmaste avgångarna från angiven station. Default: Rådmansgatan',
        'sl {station-a} {station-b} visar närmast i tid resa mellan a och b',
        'unflip me/{namn}           ställ tillbaka dig själv eller något annat```'
      ];

      help = text.join('\n');

      expect(channel.send).calledOnce.and.calledWith(help);
    });
  });

  describe('#returnRandom', function() {
    it('should be a function', function() {
      expect(utils.returnRandom).to.be.a('function');
    });

    it('should return a random value from an array', function() {
      expect(utils.returnRandom([1,2,3])).to.be.above(0).and.below(4);
    });
  });

  describe('#calculateTimeFromMinutes', function() {
    it('should be a function', function() {
      expect(utils.calculateTimeFromMinutes).to.be.a('function');
    });

    it('should return minutes with text in singular if minutes is 1', function() {
      expect(utils.calculateTimeFromMinutes(1)).to.eql('1 minut');
    });

    it('should return minutes as are with added text if value is below 60', function() {
      expect(utils.calculateTimeFromMinutes(59)).to.eql('59 minuter');
    });

    it('should return one hour if minutes is exactly 60', function() {
      expect(utils.calculateTimeFromMinutes(60)).to.eql('1 timme');
    });

    it('should return special text for the case 61 minutes', function() {
      expect(utils.calculateTimeFromMinutes(61)).to.eql('1 timme 1 minut');
    });

    it('should return any other case', function() {
      expect(utils.calculateTimeFromMinutes(188)).to.eql('3 timmar 8 minuter');
    });
  });
});