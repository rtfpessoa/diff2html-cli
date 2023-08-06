import { jest } from '@jest/globals';

let cli: typeof import('../cli');

const readFileSpy: jest.Mock<() => string> = jest.fn();
const readStdinSpy: jest.Mock<() => Promise<string>> = jest.fn();
const writeFileSpy: jest.Mock<(filePath: string, content: string) => void> = jest.fn();
const executeSpy: jest.Mock<(executable: string, args: string[]) => string> = jest.fn();
jest.unstable_mockModule('../utils', async () => ({
  readFile: readFileSpy,
  readStdin: readStdinSpy,
  execute: executeSpy,
  writeFile: writeFileSpy,
}));

const putSpy: jest.Mock<(url: string, payload: object) => Promise<unknown>> = jest.fn();
jest.unstable_mockModule('../http-utils', async () => ({
  put: putSpy,
}));

beforeEach(async () => {
  cli = await import('../cli');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('cli', () => {
  describe('getInput', () => {
    test('should readFile when inputType is `file`', async () => {
      readFileSpy.mockReturnValue('contents');

      await cli.getInput('file', ['lol', 'foo'], []);

      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(readFileSpy).toHaveBeenCalledWith('lol');
    });

    test('should readStdin when inputType is `stdin`', async () => {
      readStdinSpy.mockReturnValue(Promise.resolve('contents'));

      await cli.getInput('stdin', ['lol'], []);

      expect(readStdinSpy).toHaveBeenCalledTimes(1);
      expect(readStdinSpy).toHaveBeenCalledWith();
    });

    describe('should execute command when inputType is `command`', () => {
      test('should pass args to git command and add `--no-color` flag', async () => {
        executeSpy.mockReturnValue('');

        await cli.getInput('command', ['foo'], []);

        expect(executeSpy).toHaveBeenCalledTimes(1);
        expect(executeSpy).toHaveBeenCalledWith('git', ['diff', '--no-color', 'foo']);
      });

      test('should not add `--no-color` flag if already in args', async () => {
        executeSpy.mockReturnValue('');

        await cli.getInput('command', ['--no-color'], []);

        expect(executeSpy).toHaveBeenCalledTimes(1);
        expect(executeSpy).toHaveBeenCalledWith('git', ['diff', '--no-color']);
      });

      test('should add default flags if no args are provided', async () => {
        executeSpy.mockReturnValue('');

        await cli.getInput('command', [], []);

        expect(executeSpy).toHaveBeenCalledTimes(1);
        expect(executeSpy).toHaveBeenCalledWith('git', ['diff', '--no-color', '-M', '-C', 'HEAD']);
      });

      describe('when receiving paths to ignore', () => {
        test('should add the `--` separator if it is not already in args', async () => {
          executeSpy.mockReturnValue('');

          await cli.getInput('command', ['foo'], ['some/path']);

          expect(executeSpy).toHaveBeenCalledTimes(1);
          expect(executeSpy).toHaveBeenCalledWith('git', ['diff', '--no-color', 'foo', '--', ':(exclude)some/path']);
        });

        test('should not add `--` flag if it is already in args', async () => {
          executeSpy.mockReturnValue('');

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
        executeSpy.mockReturnValue('');

        await cli.getInput('command', ['bar'], []);

        expect(executeSpy).toHaveBeenCalledTimes(1);
        expect(executeSpy).toHaveBeenCalledWith('git', ['diff', '--no-color', 'bar']);
      });
    });
  });

  describe('preview', () => {
    test('should call `utils.writeFile`', async () => {
      writeFileSpy.mockReturnValue();

      cli.preview('a', 'b');

      expect(writeFileSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('postToDiffy', () => {
    test('should call `http.put`', async () => {
      putSpy.mockReturnValue(Promise.resolve({ id: 'foo' }));

      await cli.postToDiffy('a', 'print');

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(putSpy).toHaveBeenCalledWith('https://diffy.org/api/diff/', { diff: 'a' });
    });
  });
});
