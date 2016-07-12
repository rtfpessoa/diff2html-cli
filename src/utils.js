/*
 *
 * Diff to HTML CLI (utils.js)
 * Author: rtfpessoa
 *
 */

(function() {
  var childProcess = require('child_process');
  var fs = require('fs');

  function Utils() {
  }

  Utils.prototype.print = function(line) {
    return console.log(line);
  };

  Utils.prototype.error = function(msg) {
    return console.error(msg);
  };

  Utils.prototype.existsSync = function(filePath) {
    var result = false;

    try {
      result = fs.existsSync(filePath);
    } catch (ignore) {
      result = false;
    }

    return result || false;
  };

  Utils.prototype.readFileSync = function(filePath) {
    return fs.readFileSync(filePath, 'utf8');
  };

  Utils.prototype.readFile = function(filePath, callback) {
    return fs.readFile(filePath, {'encoding': 'utf8'}, callback);
  };

  Utils.prototype.readStdin = function(callback) {
    var content = '';
    process.stdin.resume();
    process.stdin.on('data', function(buf) {
      content += buf.toString('utf8');
    });
    process.stdin.on('end', function() {
      return callback(null, content);
    });
  };

  Utils.prototype.writeFile = function(filePath, content) {
    return fs.writeFileSync(filePath, content);
  };

  Utils.prototype.runCmd = function(cmd) {
    return childProcess.execSync(cmd).toString('utf8');
  };

  module.exports.Utils = new Utils();
})();
