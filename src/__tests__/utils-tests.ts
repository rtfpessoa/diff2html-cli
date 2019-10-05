import * as utils from "../utils";

const stringToCompare = "This is a rand0m preTTy string to write and read a file";

describe("utils", () => {
  test("should write and read file synchronously", () => {
    utils.writeFile("/tmp/file.test", stringToCompare);

    const contentRead = utils.readFile("/tmp/file.test");

    expect(stringToCompare).toBe(contentRead);
  });

  test("should execute command in shell", () => {
    const echoedValue = "echoed string";
    const result = utils.execute(`echo "${echoedValue}"`);

    expect(result).toBe(`${echoedValue}\n`);
  });

  test("should replace exactly string", () => {
    const result = utils.replaceExactly("my long and nice text", "long", "$&beautiful");

    expect(result).toBe("my $&beautiful and nice text");
  });
});
