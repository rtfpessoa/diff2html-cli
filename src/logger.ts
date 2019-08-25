export function print(message: string, ...params: (string | number | object)[]): void {
  console.log(message, ...params);
}

export function error(message: string, ...params: (string | number | object)[]): void {
  console.error(message, params);
}
