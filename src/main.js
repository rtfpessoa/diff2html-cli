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
        var sh = require('execSync');
        var command = 'git diff --word-diff-regex=. ' + program.args;
        var result = sh.exec(command);

        return result.stdout;
    }
}

function getHtml(program, input) {
    var diff2html = require('./diff2html.js');

    if (program.side) {
        return diff2html.getPrettySideBySideHtmlFromDiff(input);
    } else if (program.json) {
        return JSON.stringify(diff2html.getJsonFromDiff(input));
    } else {
        return diff2html.getPrettyHtmlFromDiff(input);
    }
}
