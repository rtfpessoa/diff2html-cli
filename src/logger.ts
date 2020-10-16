// eslint-disable-next-line @typescript-eslint/ban-types
export function print(message: string, ...params: (string | number | object)[]): void {
  console.log(message, ...params);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function error(message: string, ...params: (string | number | object)[]): void {
  console.error(message, params);
}
