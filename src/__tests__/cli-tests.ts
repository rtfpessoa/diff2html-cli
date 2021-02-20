import * as cli from '../cli';
import * as http from '../http-utils';
import * as utils from '../utils';

beforeEach(() => jest.clearAllMocks());

describe('cli', () => {
  describe('getInput', () => {
    test('should readFile when inputType is `file`', async () => {
      const readFileSpy = jest.spyOn(utils, 'readFile').mockImplementationOnce(() => 'contents');

      await cli.getInput('file', ['lol', 'foo'], []);

      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(readFileSpy).toHaveBeenCalledWith('lol');
    });

    test('should readStdin when inputType is `stdin`', async () => {
      const readStdinSpy = jest.spyOn(utils, 'readStdin').mockImplementationOnce(() => Promise.resolve('contents'));

      await cli.getInput('stdin', ['lol'], []);

      expect(readStdinSpy).toHaveBeenCalledTimes(1);
      expect(readStdinSpy).toHaveBeenCalledWith();
    });

    describe('should execute command when inputType is `command`', () => {
      test('should pass args to git command and add `--no-color` flag', async () => {
        const executeSpy = jest.spyOn(utils, 'execute').mockImplementationOnce(() => '');

        await cli.getInput('command', ['foo'], []);

        expect(executeSpy).toHaveBeenCalledTimes(1);
        expect(executeSpy).toHaveBeenCalledWith('git', ['diff', '--no-color', 'foo']);
      });

      test('should not add `--no-color` flag if already in args', async () => {
        const executeSpy = jest.spyOn(utils, 'execute').mockImplementationOnce(() => '');

        await cli.getInput('command', ['--no-color'], []);

        expect(executeSpy).toHaveBeenCalledTimes(1);
        expect(executeSpy).toHaveBeenCalledWith('git', ['diff', '--no-color']);
      });

      test('should add default flags if no args are provided', async () => {
        const executeSpy = jest.spyOn(utils, 'execute').mockImplementationOnce(() => '');

        await cli.getInput('command', [], []);

        expect(executeSpy).toHaveBeenCalledTimes(1);
        expect(executeSpy).toHaveBeenCalledWith('git', ['diff', '--no-color', '-M', '-C', 'HEAD']);
      });

      describe('when receiving paths to ignore', () => {
        test('should add the `--` separator if it is not already in args', async () => {
          const executeSpy = jest.spyOn(utils, 'execute').mockImplementationOnce(() => '');

          await cli.getInput('command', ['foo'], ['some/path']);

          expect(executeSpy).toHaveBeenCalledTimes(1);
          expect(executeSpy).toHaveBeenCalledWith('git', ['diff', '--no-color', 'foo', '--', ':(exclude)some/path']);
        });

        test('should not add `--` flag if it is already in args', async () => {
          const executeSpy = jest.spyOn(utils, 'execute').mockImplementationOnce(() => '');

          await cli.getInput('command', ['foo', '--', 'other/path'], ['some/path']);

          expect(executeSpy).toHaveBeenCalledTimes(1);
          expect(executeSpy).toHaveBeenCalledWith('git', [
            'diff',
            '--no-color',
            'foo',
            '--',
            'other/path',
            ':(exclude)some/path',
          ]);
        });
      });

      test('should not add `--` flag when there are no paths to ignore', async () => {
        const executeSpy = jest.spyOn(utils, 'execute').mockImplementationOnce(() => '');

        await cli.getInput('command', ['bar'], []);

        expect(executeSpy).toHaveBeenCalledTimes(1);
        expect(executeSpy).toHaveBeenCalledWith('git', ['diff', '--no-color', 'bar']);
      });
    });
  });

  describe('preview', () => {
    test('should call `utils.writeFile`', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const writeFileSpy = jest.spyOn(utils, 'writeFile').mockImplementationOnce(() => {});

      cli.preview('a', 'b');

      expect(writeFileSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('postToDiffy', () => {
    test('should call `http.put`', async () => {
      const putSpy = jest.spyOn(http, 'put').mockImplementationOnce(() => Promise.resolve({ id: 'foo' }));

      await cli.postToDiffy('a', 'print');

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(putSpy).toHaveBeenCalledWith('https://diffy.org/api/diff/', { diff: 'a' });
    });
  });
});
