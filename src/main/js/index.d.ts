import { Options as GlobbyOpts } from 'globby'

export type Options = Partial<GlobbyOpts> & {
  from: string,
  to: string,
  baseFrom?: string,
  baseTo?: string,
  ignoreFiles?: string | readonly string[],
  debug?: (...args: string[]) => void,
}

export function copy(opts: Options): Promise<void>

