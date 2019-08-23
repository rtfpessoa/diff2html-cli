/*
 *
 * Diff to HTML CLI (main.js)
 * Author: rtfpessoa
 *
 */

import * as yargs from 'yargs';

import * as cli from './cli';
import * as log from './logger';
import * as utils from './utils';

const currentYear = new Date().getFullYear();

const argv = yargs.usage('Usage: diff2html [options] -- [diff args]')
  .options({
    's': {
      alias: 'style',
      describe: 'Output style',
      nargs: 1,
      type: 'string',
      choices: ['line', 'side'],
      default: 'line'
    }
  })
  .options({
    'sc': {
      alias: 'synchronisedScroll',
      describe: 'Synchronised horizontal scroll',
      type: 'string',
      choices: ['enabled', 'disabled'],
      default: 'disabled'
    }
  })
  .options({
    'su': {
      alias: 'summary',
      describe: 'Show files summary',
      type: 'string',
      choices: ['closed', 'open', 'hidden'],
      default: 'closed'
    }
  })
  .options({
    'lm': {
      alias: 'matching',
      describe: 'Diff line matching type',
      nargs: 1,
      type: 'string',
      choices: ['lines', 'words', 'none'],
      default: 'none'
    }
  })
  .options({
    'lmt': {
      alias: 'matchWordsThreshold',
      describe: 'Diff line matching word threshold',
      nargs: 1,
      type: 'string',
      default: '0.25'
    }
  })
  .options({
    'lmm': {
      alias: 'matchingMaxComparisons',
      describe: 'Diff line matching maximum line comparisons of a block of changes',
      nargs: 1,
      type: 'string',
      default: '1000'
    }
  })
  .options({
    'f': {
      alias: 'format',
      describe: 'Output format',
      nargs: 1,
      type: 'string',
      choices: ['html', 'json'],
      default: 'html'
    }
  })
  .options({
    'd': {
      alias: 'diff',
      describe: 'Diff style',
      nargs: 1,
      type: 'string',
      choices: ['word', 'char'],
      default: 'word'
    }
  })
  .options({
    'i': {
      alias: 'input',
      describe: 'Diff input source',
      nargs: 1,
      type: 'string',
      choices: ['file', 'command', 'stdin'],
      default: 'command'
    }
  })
  .options({
    'o': {
      alias: 'output',
      describe: 'Output destination',
      nargs: 1,
      type: 'string',
      choices: ['preview', 'stdout'],
      default: 'preview'
    }
  })
  .options({
    'u': {
      alias: 'diffy',
      describe: 'Upload to diffy.org',
      nargs: 1,
      type: 'string',
      choices: ['browser', 'pbcopy', 'print']
    }
  })
  .options({
    'F': {
      alias: 'file',
      describe: 'Send output to file (overrides output option)',
      nargs: 1,
      type: 'string'
    }
  })
  .options({
    'hwt': {
      alias: 'htmlWrapperTemplate',
      describe: 'Use a custom template when generating markup',
      nargs: 1,
      type: 'string'
    }
  })
  .options({
    'ig': {
      alias: 'ignore',
      describe: 'ignore a file',
      nargs: 1,
      type: 'array'
    }
  })
  .example('diff2html -s line -f html -d word -i command -o preview -- -M HEAD~1',
    'diff last commit, line by line, word comparison between lines,' +
    'previewed in the browser and input from git diff command')
  .example('diff2html -i file -- my-file-diff.diff', 'reading the input from a file')
  .example('diff2html -f json -o stdout -- -M HEAD~1', 'print json format to stdout')
  .example('diff2html -F my-pretty-diff.html -- -M HEAD~1', 'print to file')
  .example('diff2html --ig package-lock.json --ig yarn.lock',
    'ignore two particular files when generating the diff')
  .help('h')
  .alias('v', 'version')
  .alias('h', 'help')
  .epilog('© 2014-' + currentYear + ' rtfpessoa\n' +
    'For more information, check out https://diff2html.xyz/\n' +
    'For support, check out https://github.com/rtfpessoa/diff2html-cli')
  .argv;

/*
 * CLI code
 */

async function onInput(err, input) {
  if (err) {
    log.error(err);
    return;
  }

  if (!input) {
    log.error('The input is empty. Try again.');
    yargs.showHelp('log');
    return;
  }

  if (argv.diffy) {
    // @ts-ignore
    await cli.postToDiffy(input, argv.u)
      .catch((error) => log.error(error));
    return;
  }

  cli.getOutput(argv, input, onOutput);
}

function onOutput(err, output) {
  if (err) {
    log.error(err);
    return;
  }

  if (argv.file) {
    utils.writeFile(argv.file, output);
  } else if (argv.output === 'preview') {
    // @ts-ignore
    cli.preview(output, argv.format);
  } else {
    log.print(output);
  }
}

// @ts-ignore
cli.getInput(argv.input, argv._, argv.ig, onInput);