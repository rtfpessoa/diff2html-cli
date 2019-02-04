var assert = require('assert');

var sinon = require('sinon')

var Cli = require('../src/cli.js').Diff2HtmlInterface;
var http = require('../src/http-utils.js').HttpUtils;
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
      Cli.getInput('abc', ['lol', 'foo'], 'callback');
      assert(spy.calledOnce);
      assert(spy.calledWith(['lol', 'foo'], 'callback'));
    });
  });

  describe('preview', function() {
    it('should call `utils.writeFile`', function() {
      let spy = sinon.stub(Utils, 'writeFile');
      Cli.preview('a', 'b');
      assert(spy.calledOnce);
    });
  });

  describe('postToDiffy', function() {
    it('should call `http.post`', function() {
      let spy = sinon.stub(http, 'post');
      Cli.postToDiffy('a', 'b', 'callback');
      assert(spy.calledOnce);
      assert(spy.calledWith('http://diffy.org/api/new', { udiff: 'a' }));
    });
  });
});
