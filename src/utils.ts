import childProcess from 'child_process';
import fs from 'fs';

export function exists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch (ignore) {
    return false;
  }
}

export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export function readStdin(): Promise<string> {
  return new Promise<string>((resolve): void => {
    let content = '';
    process.stdin.resume();
    process.stdin.on('data', buf => {
      content += buf.toString('utf8');
    });
    process.stdin.on('end', () => resolve(content));
  });
}

export function writeFile(filePath: string, content: string): void {
  return fs.writeFileSync(filePath, content);
}

export function execute(executable: string, args: string[]): string {
  return childProcess.spawnSync(executable, args, { encoding: 'utf8' }).stdout;
}

export function replaceExactly(value: string, searchValue: string, replaceValue: string): string {
  return value.replace(searchValue, () => replaceValue);
}
