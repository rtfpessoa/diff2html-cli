import * as cli from "../cli";
import * as http from "../http-utils";
import * as utils from "../utils";

beforeEach(() => jest.clearAllMocks());

describe("cli", () => {
  describe("getInput", () => {
    test("should readFile when inputType is `file`", async () => {
      const readFileSpy = jest.spyOn(utils, "readFile").mockImplementationOnce(() => "contents");

      await cli.getInput("file", ["lol", "foo"], []);

      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(readFileSpy).toHaveBeenCalledWith("lol");
    });

    test("should readStdin when inputType is `stdin`", async () => {
      const readStdinSpy = jest.spyOn(utils, "readStdin").mockImplementationOnce(() => Promise.resolve("contents"));

      await cli.getInput("stdin", ["lol"], []);

      expect(readStdinSpy).toHaveBeenCalledTimes(1);
      expect(readStdinSpy).toHaveBeenCalledWith();
    });

    test("should readStdin when inputType is `command`", async () => {
      const executeSpy = jest.spyOn(utils, "execute").mockImplementationOnce(() => "");

      await cli.getInput("command", ["lol", "foo"], []);

      expect(executeSpy).toHaveBeenCalledTimes(1);
      expect(executeSpy).toHaveBeenCalledWith('git diff "lol" "foo" --no-color ');
    });
  });

  describe("preview", () => {
    test("should call `utils.writeFile`", () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const writeFileSpy = jest.spyOn(utils, "writeFile").mockImplementationOnce(() => {});

      cli.preview("a", "b");

      expect(writeFileSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("postToDiffy", () => {
    test("should call `http.put`", async () => {
      const putSpy = jest.spyOn(http, "put").mockImplementationOnce(() => Promise.resolve({ id: "foo" }));

      await cli.postToDiffy("a", "print");

      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(putSpy).toHaveBeenCalledWith("https://diffy.org/api/diff/", { diff: "a" });
    });
  });
});
