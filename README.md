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

    Usage: diff2html [git-diff options]

    Options:

        -h, --help           output usage information
        -V, --version        output the version number
        -i, --input [file]   Diff input file.
        -o, --output [file]  Output to file path. Defaults to stdout.
        -p, --preview        Open preview in the browser.
        -l, --line           Line by Line diff.
        -s, --side           Side by Side diff.
        -j, --json           Export diff in json format.

    Example:

        diff2html -p -l "HEAD~1"

> NOTE: notice the " in the example

## Contributions

All the contributions are welcome.

To contribute just send a pull request with your changes and I will review it asap.

## License

Copyright 2014 Rodrigo Fernandes. Released under the terms of the MIT license.

## Thanks

This project is inspired in [pretty-diff](https://github.com/scottgonzalez/pretty-diff) by [Scott González](https://github.com/scottgonzalez).

---
