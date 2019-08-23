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

  HttpUtils.prototype.put = function(url, payload, callback) {
    request({
      url: url,
      method: 'PUT',
      headers: {},
      body: payload,
      json: true
    })
      .on('response', function(response) {
        response.on('data', function(body) {
          try {
            var object = JSON.parse(body.toString('utf8'));
            if (object.id) {
              return callback(null, 'https://diffy.org/diff/' + object.id);
            } else if (object.error) {
              return callback(new Error(object.error));
            } else {
              return callback(new Error(body.toString('utf8')));
            }
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
