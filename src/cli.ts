import fs from 'fs';
import os from 'os';
import path from 'path';

import * as clipboardy from 'clipboardy';
import open = require('open');
import { parse, html, Diff2HtmlConfig } from 'diff2html';

import * as http from './http-utils';
import * as log from './logger';
import { Configuration, InputType, DiffyType } from './types';
import * as utils from './utils';

function runGitDiff(gitArgsArr: string[], ignore: string[]): string {
  const baseArgs = gitArgsArr.length > 0 ? gitArgsArr.map(arg => `"${arg}"`) : ['-M', '-C', 'HEAD'];
  const colorArgs = gitArgsArr.indexOf('--no-color') < 0 ? ['--no-color'] : [];
  const ignoreArgs = ignore.map(file => `":(exclude)${file}"`);

  const diffCommand = `git diff ${baseArgs.join(' ')} ${colorArgs.join(' ')} ${ignoreArgs.join(' ')}`;

  return utils.execute(diffCommand);
}

function prepareHTML(diffHTMLContent: string, config: Configuration): string {
  const template = utils.readFile(config.htmlWrapperTemplate);

  const diff2htmlPath = path.join(path.dirname(require.resolve('diff2html')), '..');

  const cssFilePath = path.resolve(diff2htmlPath, 'bundles', 'css', 'diff2html.min.css');
  const cssContent = utils.readFile(cssFilePath);

  const jsUiFilePath = path.resolve(diff2htmlPath, 'bundles', 'js', 'diff2html-ui-slim.min.js');
  const jsUiContent = utils.readFile(jsUiFilePath);

  /* HACK:
   *   Replace needs to receive a function as the second argument to perform an exact replacement.
   *     This will avoid the replacements from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
   */
  return [
    { searchValue: '<!--diff2html-css-->', replaceValue: `<style>\n${cssContent}\n</style>` },
    { searchValue: '<!--diff2html-js-ui-->', replaceValue: `<script>\n${jsUiContent}\n</script>` },
    {
      searchValue: '//diff2html-fileListToggle',
      replaceValue: `diff2htmlUi.fileListToggle(${config.showFilesOpen});`,
    },
    {
      searchValue: '//diff2html-synchronisedScroll',
      replaceValue: config.synchronisedScroll ? `diff2htmlUi.synchronisedScroll();` : '',
    },
    {
      searchValue: '//diff2html-highlightCode',
      replaceValue: config.highlightCode ? `diff2htmlUi.highlightCode();` : '',
    },
    { searchValue: '<!--diff2html-diff-->', replaceValue: diffHTMLContent },
  ].reduce(
    (previousValue, replacement) =>
      utils.replaceExactly(previousValue, replacement.searchValue, replacement.replaceValue),
    template,
  );
}

/**
 * Get unified diff input from type
 * @param inputType - a string `file`, `stdin`, or `command`
 * @param inputArgs - a string array
 * @param ignore    - a string array
 */
export async function getInput(inputType: InputType, inputArgs: string[], ignore: string[]): Promise<string> {
  switch (inputType) {
    case 'file':
      return utils.readFile(inputArgs[0]);

    case 'stdin':
      return utils.readStdin();

    case 'command':
      return runGitDiff(inputArgs, ignore);
  }
}

export function getOutput(options: Diff2HtmlConfig, config: Configuration, input: string): string {
  if (config.htmlWrapperTemplate && !fs.existsSync(config.htmlWrapperTemplate)) {
    process.exitCode = 4;
    throw new Error(`Template ('${config.htmlWrapperTemplate}') not found!`);
  }

  const diffJson = parse(input, options);

  switch (config.formatType) {
    case 'html': {
      const htmlContent = html(diffJson, { ...options });
      return prepareHTML(htmlContent, config);
    }
    case 'json': {
      return JSON.stringify(diffJson);
    }
  }
}

export function preview(content: string, format: string): void {
  const filename = `diff.${format}`;
  const filePath: string = path.resolve(os.tmpdir(), filename);
  utils.writeFile(filePath, content);
  open(filePath, { wait: false });
}

type CreateDiffResponse = { id: string };

type ApiError = { error: string };

function isCreateDiffResponse(obj: unknown): obj is CreateDiffResponse {
  return (obj as CreateDiffResponse).id !== undefined;
}

function isApiError(obj: unknown): obj is ApiError {
  return (obj as ApiError).error !== undefined;
}

export async function postToDiffy(diff: string, diffyOutput: DiffyType): Promise<string> {
  const response = await http.put('https://diffy.org/api/diff/', { diff: diff });

  if (!isCreateDiffResponse(response)) {
    if (isApiError(response)) {
      throw new Error(response.error);
    } else {
      throw new Error(
        `Could not find 'id' of created diff in the response json.\nBody:\n\n${JSON.stringify(response, null, 2)}`,
      );
    }
  }

  const url = `https://diffy.org/diff/${response.id}`;

  log.print('Link powered by https://diffy.org');
  log.print(url);

  if (diffyOutput === 'browser') {
    open(url);
  } else if (diffyOutput === 'pbcopy') {
    clipboardy.writeSync(url);
  }

  return url;
}
