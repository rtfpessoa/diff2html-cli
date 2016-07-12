/*
 *
 * Diff to HTML CLI (http-utils.js)
 * Author: rtfpessoa
 *
 */

(function() {
  var request = require('request');

  function HttpUtils() {
  }

  HttpUtils.prototype.post = function(url, payload, callback) {
    request({
      url: url,
      method: 'POST',
      form: payload
    })
      .on('response', function(response) {
        response.on('data', function(body) {
          try {
            return callback(null, JSON.parse(body.toString('utf8')));
          } catch (err) {
            return callback(new Error('could not parse response'));
          }
        });
      })
      .on('error', function(err) {
        callback(err);
      });
  };

  module.exports.HttpUtils = new HttpUtils();
})();
