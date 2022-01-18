import path from 'path';

import { Configuration } from './types';
import { Argv } from './yargs';
import { Diff2HtmlConfig } from 'diff2html';
import { OutputFormatType, DiffStyleType, LineMatchingType } from 'diff2html/lib/types';

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
  };

  const defaultWrapperTemplate = path.resolve(__dirname, '..', 'template.html');
  const configuration: Configuration = {
    showFilesOpen: argv.summary === 'open' || false,
    synchronisedScroll: argv.synchronisedScroll,
    highlightCode: argv.highlightCode,
    formatType: argv.format,
    outputDestinationType: argv.output,
    outputDestinationFile: argv.file,
    inputSource: argv.input,
    diffyType: argv.diffy,
    htmlWrapperTemplate: argv.htmlWrapperTemplate || defaultWrapperTemplate,
    ignore: argv.ignore || [],
  };

  return [diff2htmlOptions, configuration];
}
