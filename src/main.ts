import * as cli from './cli';
import { parseArgv } from './configuration';
import * as log from './logger';
import * as utils from './utils';
import * as yargs from './yargs';

export async function main(): Promise<void> {
  try {
    const argv = yargs.setup();
    const [diff2htmlOptions, configuration] = parseArgv(argv);

    const input = await cli.getInput(configuration.inputSource, argv.extraArguments, configuration.ignore);

    if (!input) {
      log.error('The input is empty. Try again.');
      yargs.help();
      return;
    }

    if (configuration.diffyType !== undefined) {
      await cli.postToDiffy(input, configuration.diffyType);
      return;
    }

    const output = cli.getOutput(diff2htmlOptions, configuration, input);

    if (configuration.outputDestinationFile) utils.writeFile(configuration.outputDestinationFile, output);

    if (configuration.outputDestinationType === 'preview') {
      cli.preview(output, configuration.formatType);
    } else if (configuration.outputDestinationType === 'stdout') {
      log.print(output);
    }
  } catch (error) {
    log.error(error);
  }
}
