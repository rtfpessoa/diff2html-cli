import * as utils from "../utils";

const stringToCompare = "This is a rand0m preTTy string to write and read a file";

describe("utils", () => {
  test("should write and read file synchronously", () => {
    utils.writeFile("/tmp/file.test", stringToCompare);

    const contentRead = utils.readFile("/tmp/file.test");

    expect(stringToCompare).toBe(contentRead);
  });
});
