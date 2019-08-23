/*
 *
 * Diff to HTML CLI (cli.js)
 * Author: rtfpessoa
 *
 */

type InputType = 'file' | 'stdin' | 'command';
type PostType = 'browser' | 'pbcopy' | 'print';

import * as clipboardy from 'clipboardy';
import * as fs from 'fs';
import * as opn from 'open';
import * as os from 'os';
import * as path from 'path';

import { Diff2Html } from 'diff2html';

import * as http from './http-utils';
import * as log from './logger';
import * as utils from './utils';

/**
 * Get input for the diff
 * @param inputType - a string `file`, `stdin`, or `command`
 * @param inputArgs - a string array
 * @param ignore    - a string array
 * @param callback  - the callback function
 */
export function getInput(inputType: InputType, inputArgs: any[], ignore: string[], callback) {
  var that = this;
  switch (inputType) {
    case 'file':
      utils.readFile(inputArgs[0], callback);
      break;

    case 'stdin':
      utils.readStdin(callback);
      break;

    default:
      that.runGitDiff(inputArgs, ignore, callback);
  }
}

export function runGitDiff(gitArgsArr: string[], ignore: string[], callback) {
  let gitArgs: string;

  if (gitArgsArr.length && gitArgsArr[0]) {
    gitArgs = gitArgsArr.map((arg) => {
      return '"' + arg + '"'; // wrap parameters
    }).join(' ');
  } else {
    gitArgs = '-M -C HEAD';
  }

  if (gitArgs.indexOf('--no-color') < 0) {
    gitArgs += ' --no-color';
  }

  let ignoreString = '';

  if (ignore) {
    ignoreString = ignore.map((file) => {
      return ' ":(exclude)' + file + '" ';
    }).join(' ');
  }

  const diffCommand: string = 'git diff ' + gitArgs + ignoreString;

  return callback(null, utils.runCmd(diffCommand));
}

/*
 * Output
 */

export function getOutput(baseConfig, input, callback) {
  var that = this;
  var config = baseConfig;
  var defaultTemplate = path.resolve(__dirname, '..', 'template.html');
  config.wordByWord = (baseConfig.diff === 'word');
  config.charByChar = (baseConfig.diff === 'char');
  config.template = baseConfig.htmlWrapperTemplate || defaultTemplate;

  if (!fs.existsSync(config.template)) {
    return callback(new Error('Template (`' + baseConfig.template + '`) not found!'));
  }

  var jsonContent = Diff2Html.getJsonFromDiff(input, config);

  if (baseConfig.format === 'html') {
    config.inputFormat = 'json';

    if (baseConfig.style === 'side') {
      config.outputFormat = 'side-by-side';
    } else {
      config.outputFormat = 'line-by-line';
    }

    if (baseConfig.summary === 'hidden') {
      config.showFiles = false;
    } else {
      config.showFiles = true;
      config.showFilesOpen = baseConfig.summary === 'open';
    }

    config.synchronisedScroll = (baseConfig.synchronisedScroll === 'enabled');

    var htmlContent = Diff2Html.getPrettyHtml(jsonContent, config);
    return callback(null, that.prepareHTML(htmlContent, config));
  } else if (baseConfig.format === 'json') {
    return callback(null, JSON.stringify(jsonContent));
  }

  return callback(new Error('Wrong output format `' + baseConfig.format + '`!'));
}

export function prepareHTML(content, config) {
  var templatePath = config.template;
  var template = utils.readFileSync(templatePath);

  var diff2htmlPath = path.join(path.dirname(require.resolve('diff2html')), '..');

  var cssFilePath = path.resolve(diff2htmlPath, 'dist', 'diff2html.min.css');
  var cssContent = utils.readFileSync(cssFilePath);

  var jsUiFilePath = path.resolve(diff2htmlPath, 'dist', 'diff2html-ui.min.js');
  var jsUiContent = utils.readFileSync(jsUiFilePath);

  return template
    .replace('<!--diff2html-css-->', '<style>\n' + cssContent + '\n</style>')
    .replace('<!--diff2html-js-ui-->', '<script>\n' + jsUiContent + '\n</script>')
    .replace('//diff2html-fileListCloseable', 'diff2htmlUi.fileListCloseable("#diff", ' + config.showFilesOpen + ');')
    .replace('//diff2html-synchronisedScroll', 'diff2htmlUi.synchronisedScroll("#diff", ' + config.synchronisedScroll + ');')
    .replace('<!--diff2html-diff-->', content);
}

/*
 * Output destination
 */

export function preview(content: string, format: string) {
  const filename: string = 'diff.' + format;
  const filePath: string = path.resolve(os.tmpdir(), filename);
  utils.writeFile(filePath, content);
  opn(filePath, { wait: false });
}

export function postToDiffy(diff: string, postType: PostType) {
  return http
    .put('https://diffy.org/api/diff/', { diff: diff })
    .then((url) => {
      log.print('Link powered by https://diffy.org');
      log.print(url);

      if (postType === 'browser') {
        opn(url);
      } else if (postType === 'pbcopy') {
        clipboardy.writeSync(url);
      }

      return url;
    })
};
