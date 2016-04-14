# diff2html-cli

[![Circle CI](https://circleci.com/gh/rtfpessoa/diff2html-cli.svg?style=svg)](https://circleci.com/gh/rtfpessoa/diff2html-cli)
[![Codacy Code Badge](https://api.codacy.com/project/badge/grade/e6139937d72f40ed8b3920d53c74298a)](https://www.codacy.com/app/Codacy/diff2html-cli)
[![Codacy Coverage Badge](https://api.codacy.com/project/badge/coverage/e6139937d72f40ed8b3920d53c74298a)](https://www.codacy.com/app/Codacy/diff2html-cli)

[![npm](https://img.shields.io/npm/v/diff2html-cli.svg)](https://www.npmjs.com/package/diff2html-cli)
[![David](https://img.shields.io/david/rtfpessoa/diff2html-cli.svg)](https://david-dm.org/rtfpessoa/diff2html-cli)
[![David](https://img.shields.io/david/dev/rtfpessoa/diff2html-cli.svg)](https://david-dm.org/rtfpessoa/diff2html-cli)

[![node](https://img.shields.io/node/v/diff2html-cli.svg)]()
[![npm](https://img.shields.io/npm/l/diff2html-cli.svg)]()
[![npm](https://img.shields.io/npm/dm/diff2html-cli.svg)](https://www.npmjs.com/package/diff2html-cli)
[![Gitter](https://badges.gitter.im/rtfpessoa/diff2html.svg)](https://gitter.im/rtfpessoa/diff2html?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Diff to Html generates pretty HTML diffs from git diff output in your terminal

## Features

* `line-by-line` and `side-by-side` diff

* new and old line numbers

* inserted and removed lines

* GitHub like style

* Code syntax highlight

* Line similarity matching

## Online Example

> Go to [Diff2HTML](http://rtfpessoa.github.io/diff2html/)

## Distributions

* [WebJar](http://www.webjars.org/)

* [Node Module](https://www.npmjs.org/package/diff2html)

* [Bower Package](http://bower.io/search/?q=diff2html)

* [Node CLI](https://www.npmjs.org/package/diff2html-cli)

* Manually download and import `rtfpessoa/diff2html/dist/diff2html.min.js` into your page

## Setup

    npm install -g diff2html-cli

## Usage

    Usage: diff2html [options] -- [diff args]

    Options:
      -s, --style                       Output style   [string] [choices: "line", "side"] [default: "line"]
      --su, --summary                   Show files summary   [string] [choices: "closed", "open", "hidden"] [default: "closed"]
      --lm, --matching                  Diff line matching type   [string] [choices: "lines", "words", "none"] [default: "none"]
      --lmt, --matchWordsThreshold      Diff line matching word threshold   [string] [default: "0.25"]
      --lmm, --matchingMaxComparisons   Diff line matching maximum line comparisons of a block of changes [default: 2500]
      -f, --format                      Output format   [string] [choices: "html", "json"] [default: "html"]
      -d, --diff                        Diff style   [string] [choices: "word", "char"] [default: "word"]
      -i, --input                       Diff input source   [string] [choices: "file", "command", "stdin"] [default: "command"]
      -o, --output                      Output destination   [string] [choices: "preview", "stdout"] [default: "preview"]
      -u, --diffy                       Upload to diffy.org   [string] [choices: "browser", "pbcopy", "print"]
      -F, --file                        Send output to file (overrides output option)   [string]
      --version                         Show version number                    [boolean]
      -h, --help                        Show help                              [boolean]

    Examples:
      diff2html -s line -f html -d word -i command -o preview -- -M HEAD~1
          -> diff last commit, line by line, word comparison between lines,previewed
             in the browser and input from git diff command
      diff2html -i file -- my-file-diff.diff
          -> reading the input from a file
      diff2html -f json -o stdout -- -M HEAD~1
          -> print json format to stdout
      diff2html -F my-pretty-diff.html -- -M HEAD~1
          ->  print to file

    © 2014 rtfpessoa
    For support, check out https://github.com/rtfpessoa/diff2html-cli

> NOTE: notice the `--` in the examples

## Contributions

This is a developer friendly project, all the contributions are welcome.
To contribute just send a pull request with your changes following the guidelines described in `CONTRIBUTING.md`.
I will try to review them as soon as possible.

## License

Copyright 2014 Rodrigo Fernandes. Released under the terms of the MIT license.

## Thanks

This project is inspired in [pretty-diff](https://github.com/scottgonzalez/pretty-diff) by [Scott González](https://github.com/scottgonzalez).

---
