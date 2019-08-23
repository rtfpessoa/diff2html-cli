import * as cli from '../cli';
import * as http from '../http-utils';
import * as utils from '../utils';

beforeEach(() => jest.clearAllMocks());

describe('cli', () => {
  describe('getInput', () => {
    test('should readFile when inputType is `file`', () => {
      jest.spyOn(utils, 'readFile').mockImplementationOnce(() => { });

      cli.getInput('file', ['lol', 'foo'], [], 'callback');

      expect(utils.readFile).toBeCalledTimes(1);
      expect(utils.readFile).toBeCalledWith('lol', 'callback');
    });

    test('should readStdin when inputType is `stdin`', () => {
      jest.spyOn(utils, 'readStdin').mockImplementationOnce(() => { });

      cli.getInput('stdin', ['lol'], [], 'callback');

      expect(utils.readStdin).toBeCalledTimes(1);
      expect(utils.readStdin).toBeCalledWith('callback');
    });

    test('should readStdin when inputType is `command`', () => {
      jest.spyOn(cli, 'runGitDiff').mockImplementationOnce(() => { });

      cli.getInput('command', ['lol', 'foo'], [], 'callback');

      expect(cli.runGitDiff).toBeCalledTimes(1);
      expect(cli.runGitDiff).toBeCalledWith(['lol', 'foo'], [], 'callback');
    });
  });

  describe('preview', () => {
    test('should call `utils.writeFile`', () => {
      jest.spyOn(utils, 'writeFile').mockImplementationOnce(() => { });

      cli.preview('a', 'b');

      expect(utils.writeFile).toBeCalledTimes(1);
    });
  });

  describe('postToDiffy', () => {
    test('should call `http.put`', () => {
      jest.spyOn(http, 'put').mockImplementationOnce(() => Promise.resolve('http://example.com'));

      cli.postToDiffy('a', 'print');

      expect(http.put).toBeCalledTimes(1);
      expect(http.put).toBeCalledWith('https://diffy.org/api/diff/', { diff: 'a' });
    });
  });
});
