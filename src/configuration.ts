import * as path from "path";

import { Configuration } from "./types";
import { Argv } from "./yargs";

export function parseArgv(argv: Argv): [Diff2Html.Options, Configuration] {
  const diff2htmlOptions: Diff2Html.Options = {
    inputFormat: "diff",
    outputFormat: argv.style === "side" ? "side-by-side" : "line-by-line",
    showFiles: argv.summary !== "hidden",
    matching: argv.matching,
    matchWordsThreshold: argv.matchWordsThreshold,
    matchingMaxComparisons: argv.matchingMaxComparisons
  };

  const defaultWrapperTemplate = path.resolve(__dirname, "..", "template.html");
  const configuration: Configuration = {
    showFilesOpen: argv.summary === "open" || false,
    synchronisedScroll: argv.synchronisedScroll,
    formatType: argv.format,
    outputDestinationType: argv.output,
    outputDestinationFile: argv.file,
    inputSource: argv.input,
    diffyType: argv.diffy,
    htmlWrapperTemplate: argv.htmlWrapperTemplate || defaultWrapperTemplate,
    ignore: argv.ignore || []
  };

  return [diff2htmlOptions, configuration];
}
