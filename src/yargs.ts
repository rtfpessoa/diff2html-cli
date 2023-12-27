import yargs from 'yargs';
import { ColorSchemeType } from 'diff2html/lib/types.js';

import {
  StyleType,
  SummaryType,
  LineMatchingType,
  FormatType,
  InputType,
  OutputType,
  DiffyType,
  DiffStyleType,
} from './types.js';

export type Argv = {
  style: StyleType;
  fileContentToggle: boolean;
  synchronisedScroll: boolean;
  highlightCode: boolean;
  diffStyle: DiffStyleType;
  summary: SummaryType;
  matching: LineMatchingType;
  matchWordsThreshold: number;
  matchingMaxComparisons: number;
  diffMaxChanges?: number;
  diffMaxLineLength?: number;
  renderNothingWhenEmpty: boolean;
  maxLineSizeInBlockForComparison: number;
  maxLineLengthHighlight: number;
  format: FormatType;
  input: InputType;
  output: OutputType;
  diffy?: DiffyType;
  file?: string;
  htmlWrapperTemplate?: string;
  title?: string;
  ignore?: string[];
  extraArguments: string[];
  colorScheme: ColorSchemeType;
};

const defaults: Argv = {
  style: 'line',
  fileContentToggle: true,
  synchronisedScroll: true,
  highlightCode: true,
  summary: 'closed',
  diffStyle: 'word',
  matching: 'none',
  matchWordsThreshold: 0.25,
  matchingMaxComparisons: 1000,
  renderNothingWhenEmpty: false,
  maxLineSizeInBlockForComparison: 200,
  maxLineLengthHighlight: 10000,
  format: 'html',
  input: 'command',
  output: 'preview',
  ignore: [],
  diffy: undefined,
  file: undefined,
  htmlWrapperTemplate: undefined,
  title: undefined,
  extraArguments: [],
  colorScheme: ColorSchemeType.AUTO,
};

type ArgvChoices = {
  style: ReadonlyArray<StyleType>;
  summary: ReadonlyArray<SummaryType>;
  diffStyle: ReadonlyArray<DiffStyleType>;
  matching: ReadonlyArray<LineMatchingType>;
  format: ReadonlyArray<FormatType>;
  input: ReadonlyArray<InputType>;
  output: ReadonlyArray<OutputType>;
  diffy: ReadonlyArray<DiffyType>;
  colorScheme: ReadonlyArray<ColorSchemeType>;
};

const choices: ArgvChoices = {
  style: ['line', 'side'],
  summary: ['closed', 'open', 'hidden'],
  diffStyle: ['word', 'char'],
  matching: ['lines', 'words', 'none'],
  format: ['html', 'json'],
  input: ['file', 'command', 'stdin'],
  output: ['preview', 'stdout'],
  diffy: ['browser', 'pbcopy', 'print'],
  colorScheme: [ColorSchemeType.AUTO, ColorSchemeType.DARK, ColorSchemeType.LIGHT],
};

export async function setup(): Promise<Argv> {
  const currentYear = new Date().getFullYear();

  const argv = await yargs(process.argv.slice(2))
    .usage('Usage: diff2html [options] -- [diff args]')
    .option('style', {
      alias: 's',
      describe: 'Output style',
      nargs: 1,
      choices: choices.style,
      default: defaults.style,
    })
    .option('fileContentToggle', {
      alias: 'fct',
      describe: 'Show viewed checkbox to toggle file content',
      type: 'boolean',
      default: defaults.fileContentToggle,
    })
    .option('synchronisedScroll', {
      alias: 'sc',
      describe: 'Synchronised horizontal scroll',
      type: 'boolean',
      default: defaults.synchronisedScroll,
    })
    .option('highlightCode', {
      alias: 'hc',
      describe: 'Highlight Code',
      type: 'boolean',
      default: defaults.highlightCode,
    })
    .option('summary', {
      alias: 'su',
      describe: 'Show files summary',
      choices: choices.summary,
      default: defaults.summary,
    })
    .option('diffStyle', {
      alias: 'd',
      describe: 'Diff style',
      nargs: 1,
      choices: choices.diffStyle,
      default: defaults.diffStyle,
    })
    .option('matching', {
      alias: 'lm',
      describe: 'Diff line matching type',
      nargs: 1,
      choices: choices.matching,
      default: defaults.matching,
    })
    .option('matchWordsThreshold', {
      alias: 'lmt',
      describe: 'Diff line matching word threshold',
      nargs: 1,
      type: 'number',
      default: defaults.matchWordsThreshold,
    })
    .option('matchingMaxComparisons', {
      alias: 'lmm',
      describe: 'Diff line matching maximum line comparisons of a block of changes',
      nargs: 1,
      type: 'number',
      default: defaults.matchingMaxComparisons,
    })
    .option('diffMaxChanges', {
      describe: 'Number of changed lines after which a file diff is deemed as too big and not displayed',
      nargs: 1,
      type: 'number',
    })
    .option('diffMaxLineLength', {
      describe: 'Number of characters in a diff line after which a file diff is deemed as too big and not displayed',
      nargs: 1,
      type: 'number',
    })
    .option('renderNothingWhenEmpty', {
      describe: 'Render nothing if the diff shows no change in its comparison',
      type: 'boolean',
      default: defaults.renderNothingWhenEmpty,
    })
    .option('maxLineSizeInBlockForComparison', {
      describe: 'Maximum number of characters of the bigger line in a block to apply comparison',
      nargs: 1,
      type: 'number',
      default: defaults.maxLineSizeInBlockForComparison,
    })
    .option('maxLineLengthHighlight', {
      describe: 'Maximum number of characters in a line to apply highlight',
      nargs: 1,
      type: 'number',
      default: defaults.maxLineLengthHighlight,
    })
    .option('format', {
      alias: 'f',
      describe: 'Output format',
      nargs: 1,
      choices: choices.format,
      default: defaults.format,
    })
    .option('input', {
      alias: 'i',
      describe: 'Diff input source',
      nargs: 1,
      choices: choices.input,
      default: defaults.input,
    })
    .option('output', {
      alias: 'o',
      describe: 'Output destination',
      nargs: 1,
      choices: choices.output,
      default: defaults.output,
    })
    .option('diffy', {
      alias: 'u',
      describe: 'Upload to diffy.org',
      nargs: 1,
      choices: choices.diffy,
      default: defaults.diffy,
    })
    .option('file', {
      alias: 'F',
      describe: 'Send output to file (overrides output option)',
      nargs: 1,
      type: 'string',
      default: defaults.file,
    })
    .option('htmlWrapperTemplate', {
      alias: 'hwt',
      describe: 'Use a custom template when generating markup',
      nargs: 1,
      type: 'string',
      default: defaults.htmlWrapperTemplate,
    })
    .option('title', {
      alias: 't',
      describe: 'Page title for HTML output',
      nargs: 1,
      type: 'string',
      default: defaults.title,
    })
    .option('ignore', {
      alias: 'ig',
      describe: 'ignore a file',
      type: 'array',
      default: defaults.ignore,
    })
    .option('colorScheme', {
      alias: 'cs',
      describe: 'Color scheme of HTML output',
      choices: choices.colorScheme,
      default: defaults.colorScheme,
    })
    .example(
      'diff2html -s line -f html -d word -i command -o preview -- -M HEAD~1',
      'diff last commit, line by line, word comparison between lines,' +
        'previewed in the browser and input from git diff command',
    )
    .example('diff2html -i file -- my-file-diff.diff', 'reading the input from a file')
    .example('diff2html -f json -o stdout -- -M HEAD~1', 'print json format to stdout')
    .example('diff2html -F my-pretty-diff.html -- -M HEAD~1', 'print to file')
    .example('diff2html --ig package-lock.json yarn.lock', 'ignore two particular files when generating the diff')
    .help()
    .alias('help', 'h')
    .alias('help', '?')
    .version()
    .alias('version', 'v')
    .epilog(
      `© 2014-${currentYear} rtfpessoa
      For more information, check out https://diff2html.xyz/
      For support, check out https://github.com/rtfpessoa/diff2html-cli`,
    )
    .strict(true)
    .recommendCommands().argv;

  return {
    ...argv,
    ignore: argv.ignore?.map(String) || [],
    extraArguments: argv._.map(String),
  };
}
