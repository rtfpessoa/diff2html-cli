var assert = require('assert');

var sinon = require('sinon')

var Cli = require('../src/cli.js').Diff2HtmlInterface;
var Utils = require('../src/utils.js').Utils;

describe('Cli', function() {
  describe('getInput', function() {
    it('should readFile when inputType is `file`', function() {
      let spy = sinon.stub(Utils, 'readFile');
      Cli.getInput('file', ['lol', 'foo'], 'callback');
      assert(spy.calledOnce);
      assert(spy.calledWith('lol', 'callback'));
      spy.restore()
    });

    it('should readStdin when inputType is `stdin`', function() {
      let spy = sinon.stub(Utils, 'readStdin');
      Cli.getInput('stdin', ['lol'], 'callback');
      assert(spy.calledOnce);
      assert(spy.calledWith('callback'));
    });

    it('should _runGitDiff by default', function() {
      let spy = sinon.stub(Cli, '_runGitDiff');
      Cli.getInput('abc', ['lol'], 'callback');
      assert(spy.calledOnce);
      assert(spy.calledWith(['lol'], 'callback'));
    });
  });
});
