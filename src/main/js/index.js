import path from 'node:path'
import process from 'node:process'
import { cp as fsCopy, lstat as fsStat, mkdir as fsMkdir } from 'node:fs/promises'
import { globby } from 'globby'

const SPECIALS = '*{}[]?!'.split('')
const isPattern = (src) => SPECIALS.some((c) => src.includes(c))
const cp = async (src, dest, debug) => {
  debug('copy', 'from=', src, 'to=', dest)
  return fsCopy(src, dest, { recursive: true })
}

const isDir = async (src) => {
  if (isPattern(src)) return false
  if (src.endsWith('/')) return false
  try {
    return (await fsStat(src)).isDirectory()
  } catch {
    return false
  }
}

export const copy = async ({
  from,
  to,
  baseFrom = process.cwd(),
  baseTo = process.cwd(),
  debug = process.env.DEBUG ? console.log : () => {},
  ignoreFiles,
  ...opts
}) => {
  if (!from || !to) throw new Error('Both `from` and `to` arguments are required')
  if (isPattern(to)) throw new Error('`to` must not be a glob pattern')

  const _to = path.resolve(baseTo, to)
  if (to.endsWith('/')) await fsMkdir(_to, { recursive: true })

  const { patterns, dirs } = await parseSources(from, baseFrom)

  if (dirs.length === 0 && patterns.length === 1 && !isPattern(patterns[0]) || dirs.length === 1 && patterns.length === 0) {
    const f = dirs[0] || path.resolve(baseFrom, patterns[0])
    if (!!dirs[0] === await isDir(_to)) return cp(f, _to, debug)
  }

  await globby(patterns, { dot: true, ...opts, cwd: baseFrom, absolute: true, ignoreFiles }).then((files) =>
    Promise.all([
      ...files.map((file) => cp(
        file,
        path.resolve(_to, file.startsWith(baseFrom) ? path.relative(baseFrom, file) : path.basename(file)),
        debug
      )),
      ...dirs.map((dir) => cp(
        dir,
        _to,
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
      if (await isDir(entryAbs)) {
        dirs.push(entryAbs)
      } else {
        patterns.push(entry)
      }
    }),
  )

  return {patterns, dirs}
}
