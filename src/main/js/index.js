import path from 'node:path'
import process from 'node:process'
import { cp as fsCopy, lstat as fsStat } from 'node:fs/promises'
import { globby } from 'globby'

const SPECIALS = '*{}[]?!'.split()
const isFileDst = (dst) => !dst.endsWith('/') && path.basename(dst).includes('.')
const isPattern = (src) => SPECIALS.some((c) => src.includes(c))
const cp = (src, dest, debug) => {
  debug('copy', 'from=', src, 'to=', dest)
  return fsCopy(src, dest, { recursive: true })
}

export const copy = async ({
  from,
  to,
  baseFrom = process.cwd(),
  baseTo = process.cwd(),
  debug = process.env.DEBUG ? console.debug : () => {},
  ignoreFiles,
  ...opts
}) => {
  const {patterns, dirs} = await parseSources(from, baseFrom)

  if (dirs.length === 0 && patterns.length === 1 && !isPattern(patterns[0]) && isFileDst(to))
    return cp(
      path.resolve(baseFrom, patterns[0]),
      path.resolve(baseTo, to),
      debug
    )

  await globby(patterns, { dot: true, ...opts, cwd: baseFrom, absolute: true, ignoreFiles }).then((files) =>
    Promise.all([
      ...files.map((file) =>
        cp(
          file,
          path.resolve(baseTo, to, file.startsWith(baseFrom) ? path.relative(baseFrom, file) : path.basename(file)),
          debug
        ),
      ),
      ...dirs.map((dir) => cp(
        dir,
        path.resolve(baseTo, to),
        debug
      )),
    ]),
  )
}

export const parseSources = async (src, base) => {
  const entries = Array.isArray(src) ? src : [src]
  const patterns = []
  const dirs = []

  await Promise.all(
    entries.map(async (entry) => {
      const entryAbs = path.resolve(base, entry)

      try {
        if ((await fsStat(entryAbs))?.isDirectory()) {
          dirs.push(entryAbs)

          return
        }
      } catch {}

      patterns.push(entry)
    }),
  )

  return {patterns, dirs}
}
