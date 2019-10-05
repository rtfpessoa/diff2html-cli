import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import * as clipboardy from "clipboardy";
import * as opn from "open";
import { Diff2Html } from "diff2html";

import * as http from "./http-utils";
import * as log from "./logger";
import { Configuration, InputType, DiffyType } from "./types";
import * as utils from "./utils";

function runGitDiff(gitArgsArr: string[], ignore: string[]): string {
  const baseArgs = gitArgsArr.length > 0 ? gitArgsArr.map((arg) => `"${arg}"`) : ["-M", "-C", "HEAD"];
  const colorArgs = gitArgsArr.indexOf("--no-color") < 0 ? ["--no-color"] : [];
  const ignoreArgs = ignore.map((file) => `":(exclude)${file}"`);

  const diffCommand = `git diff ${baseArgs.join(" ")} ${colorArgs.join(" ")} ${ignoreArgs.join(" ")}`;

  return utils.execute(diffCommand);
}

function prepareHTML(diffHTMLContent: string, config: Configuration): string {
  const template = utils.readFile(config.htmlWrapperTemplate);

  const diff2htmlPath = path.join(path.dirname(require.resolve("diff2html")), "..");

  const cssFilePath = path.resolve(diff2htmlPath, "dist", "diff2html.min.css");
  const cssContent = utils.readFile(cssFilePath);

  const jsUiFilePath = path.resolve(diff2htmlPath, "dist", "diff2html-ui.min.js");
  const jsUiContent = utils.readFile(jsUiFilePath);

  /* HACK:
   *   Replace needs to receive a function as the second argument to perform an exact replacement.
   *     This will avoid the replacements from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
   */
  return [
    { searchValue: "<!--diff2html-css-->", replaceValue: `<style>\n${cssContent}\n</style>` },
    { searchValue: "<!--diff2html-js-ui-->", replaceValue: `<script>\n${jsUiContent}\n</script>` },
    {
      searchValue: "//diff2html-fileListCloseable",
      replaceValue: `diff2htmlUi.fileListCloseable("#diff", ${config.showFilesOpen});`
    },
    {
      searchValue: "//diff2html-synchronisedScroll",
      replaceValue: `diff2htmlUi.synchronisedScroll("#diff", ${config.synchronisedScroll});`
    },
    {
      searchValue: "//diff2html-highlightCode",
      replaceValue: config.highlightCode ? `diff2htmlUi.highlightCode("#diff");` : ""
    },
    { searchValue: "<!--diff2html-diff-->", replaceValue: diffHTMLContent }
  ].reduce(
    (previousValue, replacement) =>
      utils.replaceExactly(previousValue, replacement.searchValue, replacement.replaceValue),
    template
  );
}

/**
 * Get unified diff input from type
 * @param inputType - a string `file`, `stdin`, or `command`
 * @param inputArgs - a string array
 * @param ignore    - a string array
 */
export async function getInput(inputType: InputType, inputArgs: string[], ignore: string[]): Promise<string> {
  switch (inputType) {
    case "file":
      return utils.readFile(inputArgs[0]);

    case "stdin":
      return utils.readStdin();

    default:
      return runGitDiff(inputArgs, ignore);
  }
}

export function getOutput(options: Diff2Html.Options, config: Configuration, input: string): string {
  if (config.htmlWrapperTemplate && !fs.existsSync(config.htmlWrapperTemplate)) {
    throw new Error(`Template ('${config.htmlWrapperTemplate}') not found!`);
  }

  const diffJson = Diff2Html.getJsonFromDiff(input, options);

  if (config.formatType === "html") {
    const htmlContent = Diff2Html.getPrettyHtml(diffJson, { ...options, inputFormat: "json" });
    return prepareHTML(htmlContent, config);
  } else if (config.formatType === "json") {
    return JSON.stringify(diffJson);
  }

  throw new Error(`Wrong output format '${config.formatType}'!`);
}

export function preview(content: string, format: string): void {
  const filename = `diff.${format}`;
  const filePath: string = path.resolve(os.tmpdir(), filename);
  utils.writeFile(filePath, content);
  opn(filePath, { wait: false });
}

export async function postToDiffy(diff: string, diffyOutput: DiffyType): Promise<string> {
  const response = await http.put<{ id: string }>("https://diffy.org/api/diff/", { diff: diff });

  const url = `https://diffy.org/diff/${response.id}`;

  log.print("Link powered by https://diffy.org");
  log.print(url);

  if (diffyOutput === "browser") {
    opn(url);
  } else if (diffyOutput === "pbcopy") {
    clipboardy.writeSync(url);
  }

  return url;
}
