export function copy(opts: {
  from: string,
  to: string,
  baseFrom?: string,
  baseTo?: string,
  ignoreFiles?: string | readonly string[],
  debug?: (...args: string[]) => any,
}): Promise<void>
