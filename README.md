# diff2html-cli

[![Codacy Quality Badge](https://api.codacy.com/project/badge/Grade/e6139937d72f40ed8b3920d53c74298a)](https://www.codacy.com/app/rtfpessoa/diff2html-cli?utm_source=github.com&utm_medium=referral&utm_content=rtfpessoa/diff2html-cli&utm_campaign=Badge_Grade)
[![Codacy Coverage Badge](https://api.codacy.com/project/badge/Coverage/e6139937d72f40ed8b3920d53c74298a)](https://www.codacy.com/app/rtfpessoa/diff2html-cli?utm_source=github.com&utm_medium=referral&utm_content=rtfpessoa/diff2html-cli&utm_campaign=Badge_Coverage)
[![Circle CI](https://circleci.com/gh/rtfpessoa/diff2html-cli.svg?style=svg)](https://circleci.com/gh/rtfpessoa/diff2html-cli)

[![npm](https://img.shields.io/npm/v/diff2html-cli.svg)](https://www.npmjs.com/package/diff2html-cli)
[![David](https://img.shields.io/david/rtfpessoa/diff2html-cli.svg)](https://david-dm.org/rtfpessoa/diff2html-cli)
[![David](https://img.shields.io/david/dev/rtfpessoa/diff2html-cli.svg)](https://david-dm.org/rtfpessoa/diff2html-cli)

[![node](https://img.shields.io/node/v/diff2html-cli.svg)]() [![npm](https://img.shields.io/npm/l/diff2html-cli.svg)]()
[![npm](https://img.shields.io/npm/dm/diff2html-cli.svg)](https://www.npmjs.com/package/diff2html-cli)
[![Gitter](https://badges.gitter.im/rtfpessoa/diff2html.svg)](https://gitter.im/rtfpessoa/diff2html?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Diff to Html generates pretty HTML diffs from unified and git diff output in your terminal

## Table of Contents

<!-- toc -->

- [Features](#features)
- [Online Example](#online-example)
- [Distributions](#distributions)
- [Setup](#setup)
- [Usage](#usage)
  - [Exit Status Codes](#exit-status-codes)
  - [Custom HTML wrapper template](#custom-html-wrapper-template)
  - [Examples](#examples)
- [Contribute](#contribute)
- [Developing](#developing)
- [License](#license)
- [Thanks](#thanks)

<!-- tocstop -->

## Features

- Unified diff and Git diff input

- `line-by-line` and `side-by-side` diff

- new and old line numbers

- inserted and removed lines

- GitHub like style

- Code syntax highlight

- Line similarity matching

## Online Example

> Go to [Diff2HTML](https://diff2html.xyz/)

## Distributions

- [NPM CLI](https://www.npmjs.org/package/diff2html-cli)
- [NPM / Node.js library [ES5 & ES6]](https://github.com/rtfpessoa/diff2html)
- [CDNJS](https://cdnjs.com/libraries/diff2html)
- [WebJar](http://www.webjars.org/)

## Setup

```sh
npm install -g diff2html-cli
```

## Usage

Usage: diff2html [ flags and/or options ] -- [git diff passthrough flags and options]

| flag  | alias                    | description                                                                | choices                      | default   |
| ----- | ------------------------ | -------------------------------------------------------------------------- | ---------------------------- | --------- |
| -s    | --style                  | Output style                                                               | `line`, `side`               | `line`    |
| --sc  | --synchronisedScroll     | Synchronised horizontal scroll                                             | `true`, `false`              | `true`    |
| --hc  | --highlightCode          | Highlight code                                                             | `true`, `false`              | `true`    |
| --su  | --summary                | Show files summary                                                         | `closed`, `open`, `hidden`   | `closed`  |
| -d    | --diffStyle              | Diff style                                                                 | `word`, `char`               | `word`    |
| --lm  | --matching               | Diff line matching type                                                    | `lines`, `words`, `none`     | `none`    |
| --lmt | --matchWordsThreshold    | Diff line matching word threshold                                          |                              | `0.25`    |
| --lmm | --matchingMaxComparisons | Diff line matching maximum line comparisons of a block of changes          | `2500`                       |
| --hwt | --htmlWrapperTemplate    | Path to custom template to be rendered when using the `html` output format | `[string]`                   |
| -f    | --format                 | Output format                                                              | `html`, `json`               | `html`    |
| -i    | --input                  | Diff input source                                                          | `file`, `command`, `stdin`   | `command` |
| -o    | --output                 | Output destination                                                         | `preview`, `stdout`          | `preview` |
| -u    | --diffy                  | Upload to diffy.org                                                        | `browser`, `pbcopy`, `print` |           |
| -F    | --file                   | Send output to file (overrides output option)                              | `[string]`                   |           |
| --ig  | --ignore                 | Ignore particular files from the diff                                      | `[string]`                   |           |
| -v    | --version                | Show version number                                                        |                              |           |
| -h    | --help                   | Show help                                                                  |                              |           |

### Exit Status Codes

- :tada: 0: Success
- :dizzy_face: 1: Generic Error
- :cold_sweat: 3: Input diff is empty
- :cop: 4: Value of `--hwt | --htmlWrapperTemplate` is not a valid file

### Custom HTML wrapper template

The template is a very based on a simple replace of several placeholders as coded
https://github.com/rtfpessoa/diff2html-cli/blob/master/src/cli.ts#L40

To provide a custom template you need to make sure you have the following comments and imports in your HTML, exactly as
they are here:

- Inside the `<head>` tag

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/styles/github.min.css" />
<!--diff2html-css-->
<!--diff2html-js-ui-->
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const targetElement = document.getElementById('diff');
    const diff2htmlUi = new Diff2HtmlUI(targetElement);
    //diff2html-fileListToggle
    //diff2html-synchronisedScroll
    //diff2html-highlightCode
  });
</script>
```

- Inside the `<body>` tag

```html
<div id="diff">
  <!--diff2html-diff-->
</div>
```

### Examples

`diff2html -s line -f html -d word -i command -o preview -- -M HEAD~1`

- diff last commit, line by line, word comparison between lines, previewed in the browser and input from git diff
  command

`diff2html -i file -- my-file-diff.diff`

- reading the input from a file

`diff -u file1.txt file2.txt | diff2html -i stdin`

- reading diff from stdin

`diff2html -f json -o stdout -- -M HEAD~1`

- print json format to stdout

`diff2html -F my-pretty-diff.html -- -M HEAD~1`

- print to file

`diff2html -F my-pretty-diff.html --hwt my-custom-template.html -- -M HEAD~1`

- print to file using custom markup templates can include the following variables

`diff2html --ig package-lock.json --ig yarn.lock`

- Ignore `package-lock.json` and `yarn.lock` from the generated diff

_NOTE_: notice the `--` in the examples

## Contribute

This is a developer friendly project, all the contributions are welcome. To contribute just send a pull request with
your changes following the guidelines described in `CONTRIBUTING.md`. I will try to review them as soon as possible.

## Developing

Make some changes, `yarn build` and then `./bin/diff2html` 😉

## License

Copyright 2014-present Rodrigo Fernandes. Released under the terms of the MIT license.

## Thanks

This project is inspired in [pretty-diff](https://github.com/scottgonzalez/pretty-diff) by
[Scott González](https://github.com/scottgonzalez).

---
