import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { Configuration } from './types.js';
import { Argv } from './yargs.js';
import { Diff2HtmlConfig } from 'diff2html';
import { OutputFormatType, DiffStyleType, LineMatchingType } from 'diff2html/lib/types.js';

export function parseArgv(argv: Argv): [Diff2HtmlConfig, Configuration] {
  const diff2htmlOptions: Diff2HtmlConfig = {
    outputFormat:
      argv.style === 'side'
        ? OutputFormatType.SIDE_BY_SIDE
        : argv.style === 'line'
        ? OutputFormatType.LINE_BY_LINE
        : undefined,
    diffStyle:
      argv.diffStyle === 'char' ? DiffStyleType.CHAR : argv.diffStyle === 'word' ? DiffStyleType.WORD : undefined,
    matching:
      argv.matching === 'lines'
        ? LineMatchingType.LINES
        : argv.matching === 'words'
        ? LineMatchingType.WORDS
        : argv.matching === 'none'
        ? LineMatchingType.NONE
        : undefined,
    drawFileList: argv.summary !== 'hidden',
    matchWordsThreshold: argv.matchWordsThreshold,
    matchingMaxComparisons: argv.matchingMaxComparisons,
    diffMaxChanges: argv.diffMaxChanges,
    diffMaxLineLength: argv.diffMaxLineLength,
    renderNothingWhenEmpty: argv.renderNothingWhenEmpty,
    maxLineSizeInBlockForComparison: argv.maxLineSizeInBlockForComparison,
    maxLineLengthHighlight: argv.maxLineLengthHighlight,
    colorScheme: argv.colorScheme,
  };

  const defaultPageTitle = 'Diff to HTML by rtfpessoa';
  const defaultPageHeader = 'Diff to HTML by <a href="https://github.com/rtfpessoa">rtfpessoa</a>';
  const defaultWrapperTemplate = resolve(__dirname, '..', 'template.html');
  const configuration: Configuration = {
    showFilesOpen: argv.summary === 'open' || false,
    fileContentToggle: argv.fileContentToggle,
    synchronisedScroll: argv.synchronisedScroll,
    highlightCode: argv.highlightCode,
    formatType: argv.format,
    outputDestinationType: argv.output,
    outputDestinationFile: argv.file,
    inputSource: argv.input,
    diffyType: argv.diffy,
    htmlWrapperTemplate: argv.htmlWrapperTemplate || defaultWrapperTemplate,
    pageTitle: argv.title || defaultPageTitle,
    pageHeader: argv.title || defaultPageHeader,
    ignore: argv.ignore || [],
  };

  return [diff2htmlOptions, configuration];
}
