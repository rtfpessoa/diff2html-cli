/*
 *
 * diff2html CLI (main.js)
 * Author: rtfpessoa
 *
 */

var argv = require('yargs')
  .usage('Usage: diff2html [options]')
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
      choices: ['file', 'command'],
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
    'F': {
      alias: 'file',
      describe: 'Send output to file (overrides output option)',
      nargs: 1,
      type: 'string'
    }
  })
  .example('diff2html -s line -f html -d word -i command -o preview -- -M HEAD~1',
  'diff last commit, line by line, word comparison between lines, previewed in the browser and input from git diff command')
  .example('diff2html -i file -- my-file-diff.diff', 'reading the input from a file')
  .example('diff2html -f json -o stdout -- -M HEAD~1', 'print json format to stdout')
  .example('diff2html -F my-pretty-diff.html -- -M HEAD~1', 'print to file')
  .version(function () {
    return require('../package').version;
  })
  .help('h')
  .alias('h', 'help')
  .epilog('Copyright 2015\n' +
  'For support, check out https://github.com/rtfpessoa/diff2html-cli')
  .argv;

main();

function main() {
  var input = getInput();
  if (input) {
    var content = getOutput(input);

    if (argv.F) {
      writeFile(argv.F, content);
    } else if (argv.output == 'preview') {
      preview(content);
    } else {
      print(content);
    }
  } else {
    error("The input is empty. Try again.");
    argv.help();
  }

  process.exit(0);
}

function getInput() {
  if (argv.input == 'file') {
    return readFile(argv._[0]);
  } else {
    var gitArgs;
    if (argv._.length && argv._[0]) {
      gitArgs = argv._.join(" ");
    } else {
      gitArgs = "-M HEAD~1"
    }

    var diffCommand = 'git diff ' + gitArgs;
    return runCmd(diffCommand);
  }
}

function getOutput(input) {
  var diff2Html = require('diff2html').Diff2Html;

  var config = {};
  config.wordByWord = (argv.diff === 'word');
  config.charByChar = (argv.diff === 'char');

  if (argv.format === 'html') {
    var htmlContent;
    if (argv.style === 'side') {
      htmlContent = diff2Html.getPrettySideBySideHtmlFromDiff(input, config);
    } else {
      htmlContent = diff2Html.getPrettyHtmlFromDiff(input, config);
    }
    return prepareHTML(htmlContent);
  } else {
    var jsonContent = diff2Html.getJsonFromDiff(input, config);
    return prepareJSON(jsonContent);
  }
}

function preview(content) {
  var filePath = "/tmp/diff." + argv.format;
  writeFile(filePath, content);
  runCmd("open " + filePath);
}

function prepareHTML(content) {
  var template = readFile(__dirname + "/../dist/template.html", "utf8");
  var css = readFile(__dirname + "/../dist/diff2html.css", "utf8");
  return template
    .replace("{{css}}", css)
    .replace("{{diff}}", content);
}

function prepareJSON(content) {
  return JSON.stringify(content);
}

function print(line) {
  console.log(line);
}

function error(msg) {
  console.error(msg);
}

function readFile(filePath) {
  var fs = require('fs');
  return fs.readFileSync(filePath, "utf8");
}

function writeFile(filePath, content) {
  var fs = require('fs');
  fs.writeFileSync(filePath, content);
}

function runCmd(cmd) {
  var childProcess = require('child_process');
  return childProcess.execSync(cmd).toString('utf8');
}
