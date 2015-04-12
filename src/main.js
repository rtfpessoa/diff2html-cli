require('pkginfo')(module, 'version');

var fs = require('fs');
var program = require('commander');
var appVersion = module.exports.version;

program.version(appVersion);
program.usage('[git-diff options]');

program
  .option('-i, --input [file]', 'Diff input file.')
  .option('-o, --output [file]', 'Output to file path. Defaults to stdout.')
  .option('-p, --preview', 'Open preview in the browser.')
  .option('-l, --line', 'Line by Line diff.')
  .option('-s, --side', 'Side by Side diff.')
  .option('-w, --word', 'Word by Word highlight.')
  .option('-c, --char', 'Char by Char highlight.')
  .option('-j, --json', 'Export diff in json format.');

program.on('--help', function () {
  console.log('For support, check out https://github.com/rtfpessoa/diff2html-nodejs');
});

program.parse(process.argv);

main(program);

function main(program) {
  var input = getInput(program);
  if (input) {
    var content = getHtml(program, input);

    if (program.output) {
      fs.writeFileSync(program.output, content);
    } else if (!program.json && program.preview) {
      preview(content)
    } else {
      console.log(content);
    }
  } else {
    console.error("The diff is empty. Try another command.");
    program.help();
  }

  process.exit(0);
}

function preview(diffHTML) {
  var exec = require("child_process").exec;

  var template = fs.readFileSync(__dirname + "/../dist/template.html", "utf8");

  var cssDir = __dirname + "/../dist/diff2html.css";

  var template = template.replace("{{css}}", cssDir).replace("{{diff}}", diffHTML);

  fs.writeFileSync("/tmp/diff.html", template);

  exec("open /tmp/diff.html");
}

function getInput(program) {
  if (program.input) {
    return fs.readFileSync(program.input, "utf8");
  } else {
    var childProcess = require('child_process');
    var lineDiffCommand = 'git diff ' + program.args;

    return childProcess.execSync(lineDiffCommand).toString('utf8');
  }
}

function getHtml(program, input) {
  var diff2Html = require('diff2html').Diff2Html;

  var config = {};
  config.wordByWord = program.word;
  config.charByChar = program.char;

  if (program.side) {
    return diff2Html.getPrettySideBySideHtmlFromDiff(input, config);
  } else if (program.json) {
    return JSON.stringify(diff2Html.getJsonFromDiff(input, config));
  } else {
    return diff2Html.getPrettyHtmlFromDiff(input, config);
  }
}
