import { jest, expect } from '@jest/globals';

import { Configuration, InputType } from '../types';
import { Diff2HtmlConfig } from 'diff2html';

let command: typeof import('../main');

const getInputSpy: jest.Mock<(inputType: InputType, inputArgs: string[], ignore: string[]) => Promise<string>> =
  jest.fn();
const getOutputSpy: jest.Mock<(options: Diff2HtmlConfig, config: Configuration, input: string) => string> = jest.fn();
const previewSpy: jest.Mock<(content: string, format: string) => void> = jest.fn();
jest.unstable_mockModule('../cli', async () => ({
  getInput: getInputSpy,
  getOutput: getOutputSpy,
  preview: previewSpy,
}));

beforeEach(async () => {
  command = await import('../main');
});

afterEach(() => {
  jest.clearAllMocks();
});

process.argv = ['node', 'diff2html.js', '-i', 'file', '--', 'test'];

describe('cli', () => {
  test('should parse input and run', async () => {
    getInputSpy.mockReturnValue(Promise.resolve('input'));
    getOutputSpy.mockReturnValue('output');
    previewSpy.mockReturnValue();

    await command.main();

    expect(getInputSpy).toHaveBeenCalledTimes(1);
    expect(getInputSpy).toHaveBeenCalledWith('file', ['test'], []);

    expect(getOutputSpy).toHaveBeenCalledTimes(1);
    expect(getOutputSpy).toHaveBeenCalledWith(
      {
        diffMaxChanges: undefined,
        diffMaxLineLength: undefined,
        diffStyle: 'word',
        drawFileList: true,
        matchWordsThreshold: 0.25,
        matching: 'none',
        matchingMaxComparisons: 1000,
        maxLineLengthHighlight: 10000,
        maxLineSizeInBlockForComparison: 200,
        outputFormat: 'line-by-line',
        renderNothingWhenEmpty: false,
        colorScheme: 'auto',
      },
      {
        diffyType: undefined,
        fileContentToggle: true,
        formatType: 'html',
        highlightCode: true,
        htmlWrapperTemplate: expect.stringContaining('diff2html-cli/template.html'),
        ignore: [],
        inputSource: 'file',
        outputDestinationFile: undefined,
        outputDestinationType: 'preview',
        pageHeader: 'Diff to HTML by <a href="https://github.com/rtfpessoa">rtfpessoa</a>',
        pageTitle: 'Diff to HTML by rtfpessoa',
        showFilesOpen: false,
        synchronisedScroll: true,
      },
      'input',
    );
  });
});
