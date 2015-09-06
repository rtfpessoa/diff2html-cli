# Diff to Html CLI by [rtfpessoa](https://github.com/rtfpessoa)

Diff to Html generates pretty HTML diffs from git diff output in your terminal

## Features

* `line-by-line` and `side-by-side` diff

* new and old line numbers

* inserted and removed lines

* GitHub like style

* Code syntax highlight

## Online Example

> Go to [Diff2HTML](http://rtfpessoa.github.io/diff2html/)

## Distributions

* [WebJar](http://www.webjars.org/)

* [Node Module](https://www.npmjs.org/package/diff2html)

* [Bower Package](http://bower.io/search/?q=diff2html)

* [Node CLI](https://www.npmjs.org/package/diff2html-cli)

* Manually download and import `rtfpessoa/diff2html/dist/diff2html.min.js` into your page

## Setup

    sudo npm install -g diff2html-cli

## Usage

    diff2html [options] -- [diff args]


    Options:
      -s, --style   Output style
                                [string] [choices: "line", "side"] [default: "line"]
      -f, --format  Output format
                                [string] [choices: "html", "json"] [default: "html"]
      -d, --diff    Diff style  [string] [choices: "word", "char"] [default: "word"]
      -i, --input   Diff input source
                          [string] [choices: "file", "command"] [default: "command"]
      -o, --output  Output destination
                        [string] [choices: "preview", "stdout"] [default: "preview"]
      -F, --file    Send output to file (overrides output option)           [string]
      --version     Show version number                                    [boolean]
      -h, --help    Show help                                              [boolean]


    Examples:
      diff2html -s line -f html -d word -i      diff last commit, line by line, word
      command -o preview -- -M HEAD~1           comparison between lines,previewed
                                                in the browser and input from git
                                                diff command
      diff2html -i file -- my-file-diff.diff    reading the input from a file
      diff2html -f json -o stdout -- -M HEAD~1  print json format to stdout
      diff2html -F my-pretty-diff.html -- -M    print to file
      HEAD~1


    © 2015 rtfpessoa
    For support, check out https://github.com/rtfpessoa/diff2html-cli

> NOTE: notice the `--` in the examples

## Contributions

All the contributions are welcome.

To contribute just send a pull request with your changes and I will review it asap.

## License

Copyright 2014 Rodrigo Fernandes. Released under the terms of the MIT license.

## Thanks

This project is inspired in [pretty-diff](https://github.com/scottgonzalez/pretty-diff) by [Scott González](https://github.com/scottgonzalez).

---
