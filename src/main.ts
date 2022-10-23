import * as cli from './cli';
import { parseArgv } from './configuration';
import * as log from './logger';
import * as utils from './utils';
import * as yargs from './yargs';

export async function main(): Promise<void> {
  try {
    const argv = await yargs.setup();
    const [diff2htmlOptions, configuration] = parseArgv(argv);

    const input = await cli.getInput(configuration.inputSource, argv.extraArguments, configuration.ignore);

    if (!input) {
      process.exitCode = 3;
      log.error('The input is empty. Try again.');
      yargs.help();
      return;
    }

    if (configuration.diffyType !== undefined) {
      await cli.postToDiffy(input, configuration.diffyType);
      return;
    }

    const output = cli.getOutput(diff2htmlOptions, configuration, input);

    if (configuration.outputDestinationFile) {
      utils.writeFile(configuration.outputDestinationFile, output);
    } else {
      switch (configuration.outputDestinationType) {
        case 'preview':
          return cli.preview(output, configuration.formatType);

        case 'stdout':
          return log.print(output);
      }
    }
  } catch (error) {
    if (process.exitCode === undefined || process.exitCode === 0) {
      process.exitCode = 1;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyError = error as any;
    log.error(anyError);
  }
}
