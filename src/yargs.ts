import * as yargs from 'yargs';

import {
  StyleType,
  SummaryType,
  LineMatchingType,
  FormatType,
  InputType,
  OutputType,
  DiffyType,
  DiffStyleType,
} from './types';

export type Argv = {
  style: StyleType;
  synchronisedScroll: boolean;
  highlightCode: boolean;
  diffStyle: DiffStyleType;
  summary: SummaryType;
  matching: LineMatchingType;
  matchWordsThreshold: number;
  matchingMaxComparisons: number;
  format: FormatType;
  input: InputType;
  output: OutputType;
  diffy?: DiffyType;
  file?: string;
  htmlWrapperTemplate?: string;
  ignore?: string[];
  extraArguments: string[];
};

export function setup(): Argv {
  const currentYear = new Date().getFullYear();

  const styleChoices: StyleType[] = ['line', 'side'];
  const summaryChoices: SummaryType[] = ['closed', 'open', 'hidden'];
  const diffStyleChoices: DiffStyleType[] = ['word', 'char'];
  const matchingChoices: LineMatchingType[] = ['lines', 'words', 'none'];
  const formatChoices: FormatType[] = ['html', 'json'];
  const inputChoices: InputType[] = ['file', 'command', 'stdin'];
  const outputChoices: OutputType[] = ['preview', 'stdout'];
  const diffyChoices: DiffyType[] = ['browser', 'pbcopy', 'print'];

  const argv = yargs
    .usage('Usage: diff2html [options] -- [diff args]')
    .options({
      style: {
        alias: 's',
        describe: 'Output style',
        nargs: 1,
        type: 'string',
        choices: styleChoices,
        default: 'line',
      },
    })
    .options({
      synchronisedScroll: {
        alias: 'sc',
        describe: 'Synchronised horizontal scroll',
        type: 'boolean',
        default: true,
      },
    })
    .options({
      highlightCode: {
        alias: 'hc',
        describe: 'Highlight Code',
        type: 'boolean',
        default: true,
      },
    })
    .options({
      summary: {
        alias: 'su',
        describe: 'Show files summary',
        type: 'string',
        choices: summaryChoices,
        default: 'closed',
      },
    })
    .options({
      diff: {
        alias: 'd',
        describe: 'Diff style',
        nargs: 1,
        type: 'string',
        choices: diffStyleChoices,
        default: 'word',
      },
    })
    .options({
      matching: {
        alias: 'lm',
        describe: 'Diff line matching type',
        nargs: 1,
        type: 'string',
        choices: matchingChoices,
        default: 'none',
      },
    })
    .options({
      matchWordsThreshold: {
        alias: 'lmt',
        describe: 'Diff line matching word threshold',
        nargs: 1,
        type: 'number',
        default: 0.25,
      },
    })
    .options({
      matchingMaxComparisons: {
        alias: 'lmm',
        describe: 'Diff line matching maximum line comparisons of a block of changes',
        nargs: 1,
        type: 'number',
        default: 1000,
      },
    })
    .options({
      format: {
        alias: 'f',
        describe: 'Output format',
        nargs: 1,
        type: 'string',
        choices: formatChoices,
        default: 'html',
      },
    })
    .options({
      input: {
        alias: 'i',
        describe: 'Diff input source',
        nargs: 1,
        type: 'string',
        choices: inputChoices,
        default: 'command',
      },
    })
    .options({
      output: {
        alias: 'o',
        describe: 'Output destination',
        nargs: 1,
        type: 'string',
        choices: outputChoices,
        default: 'preview',
      },
    })
    .options({
      diffy: {
        alias: 'u',
        describe: 'Upload to diffy.org',
        nargs: 1,
        type: 'string',
        choices: diffyChoices,
      },
    })
    .options({
      file: {
        alias: 'F',
        describe: 'Send output to file (overrides output option)',
        nargs: 1,
        type: 'string',
      },
    })
    .options({
      htmlWrapperTemplate: {
        alias: 'hwt',
        describe: 'Use a custom template when generating markup',
        nargs: 1,
        type: 'string',
      },
    })
    .options({
      ignore: {
        alias: 'ig',
        describe: 'ignore a file',
        nargs: 1,
        type: 'array',
      },
    })
    .example(
      'diff2html -s line -f html -d word -i command -o preview -- -M HEAD~1',
      'diff last commit, line by line, word comparison between lines,' +
        'previewed in the browser and input from git diff command',
    )
    .example('diff2html -i file -- my-file-diff.diff', 'reading the input from a file')
    .example('diff2html -f json -o stdout -- -M HEAD~1', 'print json format to stdout')
    .example('diff2html -F my-pretty-diff.html -- -M HEAD~1', 'print to file')
    .example('diff2html --ig package-lock.json --ig yarn.lock', 'ignore two particular files when generating the diff')
    .help('h')
    .alias('v', 'version')
    .alias('h', 'help')
    .epilog(
      `© 2014-${currentYear} rtfpessoa
      For more information, check out https://diff2html.xyz/
      For support, check out https://github.com/rtfpessoa/diff2html-cli`,
    )
    .strict(true)
    .recommendCommands().argv;

  // HACK: Forcing conversions to better types here, since choices types are enforced in the beginning
  return {
    ...argv,
    style: argv.style as StyleType,
    summary: argv.summary as SummaryType,
    diffStyle: argv.diffStyle as DiffStyleType,
    matching: argv.matching as LineMatchingType,
    format: argv.format as FormatType,
    input: argv.input as InputType,
    output: argv.output as OutputType,
    diffy: argv.diffy as DiffyType,
    ignore: (argv.ignore || []).map(e => e.toString()),
    extraArguments: argv._ || [],
  };
}

export function help(): void {
  yargs.showHelp('log');
}
