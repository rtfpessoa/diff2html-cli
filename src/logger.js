/*
 *
 * Diff to HTML CLI (logger.js)
 * Author: rtfpessoa
 *
 */

(function() {
  function Logger() {
  }

  Logger.prototype.print = function(line) {
    console.log(line);
  };

  Logger.prototype.error = function(msg) {
    console.error(msg);
  };

  module.exports.Logger = new Logger();
})();
