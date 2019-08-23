import * as utils from '../utils';

beforeEach(() => jest.clearAllMocks());

describe('utils', () => {
  describe('io', () => {
    var stringToCompare = 'This is a rand0m preTTy string to write and read a file';

    test('should write and read file synchronously', () => {
      utils.writeFile('/tmp/file.test', stringToCompare);

      var contentRead = utils.readFileSync('/tmp/file.test');

      expect(stringToCompare).toBe(contentRead);
    });

    test('should write synchronously and read file asynchronously', (done) => {
      utils.writeFile('/tmp/file.test', stringToCompare);

      utils.readFile('/tmp/file.test', function (err, content) {
        expect(err).toBe(null);
        expect(stringToCompare).toBe(content);
        done();
      });
    });
  });
});
