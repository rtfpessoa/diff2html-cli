require('pkginfo')(module, 'version');

var program = require('commander');
var appVersion = module.exports.version;

program.version(appVersion);
program.usage('[git-diff options]');

program
    .option('-i, --input [file]', 'Diff input file.')
    .option('-o, --output [file]', 'Output to file path. Defaults to stdout.');

program.on('--help', function () {
    console.log('For support, check out github.com/rtfpessoa/diff2html-node');
});

program.parse(process.argv);

main(program);

function main(program) {
    var fs = require('fs');
    var diff2html = require('./diff2html.js');

    var input = getInput(program);
    if (input) {
        var content = diff2html.getPrettyHtmlFromDiff(input);

        if (program.output) {
            fs.writeFileSync(program.output, content);
        } else {
            console.log(content);
        }
    } else {
        program.help();
    }

    process.exit(0);
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
