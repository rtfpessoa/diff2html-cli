#!/usr/bin/env node
/*
 *
 * Diff to HTML CLI (main.js)
 * Author: rtfpessoa
 *
 */

var childProcess = require('child_process');
var diff2Html = require('diff2html').Diff2Html;
var fs = require('fs');
var request = require('request');

var argv = require('yargs')
  .usage('Usage: diff2html [options] -- [diff args]')
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
  .example('diff2html -s line -f html -d word -i command -o preview -- -M HEAD~1',
    'diff last commit, line by line, word comparison between lines,' +
    'previewed in the browser and input from git diff command')
  .example('diff2html -i file -- my-file-diff.diff', 'reading the input from a file')
  .example('diff2html -f json -o stdout -- -M HEAD~1', 'print json format to stdout')
  .example('diff2html -F my-pretty-diff.html -- -M HEAD~1', 'print to file')
  .version(function() {
    return require('../package').version;
  })
  .help('h')
  .alias('h', 'help')
  .epilog('© 2015 rtfpessoa\n' +
    'For support, check out https://github.com/rtfpessoa/diff2html-cli')
  .argv;

function getInput(callback) {
  switch (argv.input) {
    case 'file':
      readFile(argv._[0], callback);
      break;

    case 'stdin':
      readStdin(callback);
      break;

    default:
      runGitDiff(callback);
  }
}

function runGitDiff(callback) {
  var gitArgs;
  if (argv._.length && argv._[0]) {
    gitArgs = argv._.join(' ');
  } else {
    gitArgs = '-M HEAD~1'
  }

  var diffCommand = 'git diff ' + gitArgs;
  return callback(null, runCmd(diffCommand));
}

function getOutput(input) {
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
  var filePath = '/tmp/diff.' + argv.format;
  writeFile(filePath, content);
  runCmd('open ' + filePath);
}

function prepareHTML(content) {
  var template = readFileSync(__dirname + '/../dist/template.html', 'utf8');
  var css = readFileSync(__dirname + '/../dist/diff2html.css', 'utf8');
  return template
    .replace('<!--css-->', '<style>\n' + css + '\n</style>')
    .replace('<!--diff-->', content);
}

function postToDiffy(diff, postType) {
  var jsonParams = {udiff: diff};

  post('http://diffy.org/api/new', jsonParams, function(err, response) {
    if (err) {
      print(err);
      return;
    }

    if (response.status != 'error') {
      print("Link powered by diffy.org:");
      print(response.url);

      if (postType === 'browser') {
        runCmd('open ' + response.url);
      } else if (postType === 'pbcopy') {
        runCmd('echo "' + response.url + '" | pbcopy');
      }
    } else {
      print("Error: " + message);
    }
  });
}

function post(url, payload, callback) {
  request({
    url: url,
    method: 'POST',
    form: payload
  })
    .on('response', function(response) {
      response.on('data', function(body) {
        try {
          callback(null, JSON.parse(body.toString('utf8')));
        } catch (err) {
          callback(new Error('could not parse response'));
        }
      })
    })
    .on('error', function(err) {
      callback(err);
    });
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

function readFileSync(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readFile(filePath, callback) {
  return fs.readFile(filePath, {'encoding': 'utf8'}, callback);
}

function readStdin(callback) {
  var content = '';
  process.stdin.resume();
  process.stdin.on('data', function(buf) {
    content += buf.toString('utf8');
  });
  process.stdin.on('end', function() {
    callback(null, content);
  });
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content);
}

function runCmd(cmd) {
  return childProcess.execSync(cmd).toString('utf8');
}

/*
 * CLI code
 */

getInput(function(err, input) {
  if (err) {
    print(err);
    return;
  }

  if (!input) {
    error('The input is empty. Try again.');
    argv.help();
  }

  if (argv.diffy) {
    postToDiffy(input, argv.diffy);
    return;
  }

  var output = getOutput(input);
  if (argv.file) {
    writeFile(argv.file, output);
  } else if (argv.output === 'preview') {
    preview(output);
  } else {
    print(output);
  }
});
