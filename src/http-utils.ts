/*
 *
 * Diff to HTML CLI (http-utils.js)
 * Author: rtfpessoa
 *
 */

import * as request from 'request';

export function put(url, payload) {
  return new Promise<string>((resolve, reject) => {
    request({
      url: url,
      method: 'PUT',
      headers: {},
      body: payload,
      json: true
    })
      .on('response', function (response) {
        response.on('data', function (body) {
          try {
            var object = JSON.parse(body.toString('utf8'));
            if (object.id) {
              return resolve('https://diffy.org/diff/' + object.id);
            } else if (object.error) {
              return reject(new Error(object.error));
            } else {
              return reject(new Error(body.toString('utf8')));
            }
          } catch (err) {
            return reject(new Error('could not parse response'));
          }
        });
      })
      .on('error', function (err) {
        reject(err);
      })
  });
};
