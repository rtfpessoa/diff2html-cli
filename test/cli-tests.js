var assert = require('assert');

var sinon = require('sinon');

var Cli = require('../built/cli.js');
var http = require('../built/http-utils.js').HttpUtils;
var Utils = require('../built/utils.js').Utils;

describe('Cli', function() {
  describe('getInput', function() {
    it('should readFile when inputType is `file`', function() {
      var spy = sinon.stub(Utils, 'readFile');
      Cli.getInput('file', ['lol', 'foo'], 'ignore', 'callback');
      assert(spy.calledOnce);
      assert(spy.calledWith('lol', 'callback'));
      spy.restore();
    });

    it('should readStdin when inputType is `stdin`', function() {
      var spy = sinon.stub(Utils, 'readStdin');
      Cli.getInput('stdin', ['lol'], 'ignore', 'callback');
      assert(spy.calledOnce);
      assert(spy.calledWith('callback'));
      spy.restore();
    });

    it('should runGitDiff by default', function() {
      var spy = sinon.stub(Cli, 'runGitDiff');
      Cli.getInput('abc', ['lol', 'foo'], 'ignore', 'callback');
      assert(spy.calledOnce);
      assert(spy.calledWith(['lol', 'foo'], 'ignore', 'callback'));
    });
  });

  describe('preview', function() {
    it('should call `utils.writeFile`', function() {
      var spy = sinon.stub(Utils, 'writeFile');
      Cli.preview('a', 'b');
      assert(spy.calledOnce);
      spy.restore();
    });
  });

  describe('postToDiffy', function() {
    it('should call `http.post`', function() {
      var spy = sinon.stub(http, 'post');
      Cli.postToDiffy('a', 'b', 'callback');
      assert(spy.calledOnce);
      assert(spy.calledWith('http://diffy.org/api/new', { udiff: 'a' }));
    });
  });
});
