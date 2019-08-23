/*
 *
 * Diff to HTML CLI (utils.js)
 * Author: rtfpessoa
 *
 */

import * as childProcess from 'child_process';
import * as fs from 'fs';

export function existsSync(filePath) {
  var result = false;

  try {
    result = fs.existsSync(filePath);
  } catch (ignore) {
    result = false;
  }

  return result || false;
};

export function readFileSync(filePath) {
  return fs.readFileSync(filePath, 'utf8');
};

export function readFile(filePath, callback) {
  return fs.readFile(filePath, { 'encoding': 'utf8' }, callback);
};

export function readStdin(callback) {
  var content = '';
  process.stdin.resume();
  process.stdin.on('data', function (buf) {
    content += buf.toString('utf8');
  });
  process.stdin.on('end', function () {
    return callback(null, content);
  });
};

export function writeFile(filePath, content) {
  return fs.writeFileSync(filePath, content);
};

export function runCmd(cmd) {
  return childProcess.execSync(cmd).toString('utf8');
};
