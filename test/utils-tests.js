var assert = require('assert');

var Utils = require('../built/utils.js').Utils;

describe('Utils', function() {
  describe('IO', function() {
    var stringToCompare = 'This is a rand0m preTTy string to write and read a file';

    it('should write and read file synchronously', function() {
      Utils.writeFile('/tmp/file.test', stringToCompare);

      var contentRead = Utils.readFileSync('/tmp/file.test');
      assert.equal(stringToCompare, contentRead);
    });

    it('should write synchronously and read file asynchronously', function(done) {
      Utils.writeFile('/tmp/file.test', stringToCompare);

      Utils.readFile('/tmp/file.test', function(err, content) {
        assert.equal(err, null);
        assert.equal(stringToCompare, content);
        done();
      });
    });
  });
});
