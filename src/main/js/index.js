import path from 'node:path'
import fs from 'fs-extra'
import {globby} from 'globby'

export const copy = async ({
  from,
  to,
  baseFrom = process.cwd(),
  baseTo = process.cwd(),
  debug = () => {},
  ignoreFiles
}) => {
  const {patterns, dirs} = await parseSources(from, baseFrom)
  const cp = (src, dest) => {
    debug('copy', 'from=', src, 'to=', dest)
    return fs.copy(src, dest)
  }

  await globby(patterns, { cwd: baseFrom, absolute: true, ignoreFiles }).then((files) =>
    Promise.all([
      ...files.map((file) =>
        cp(
          file,
          path.resolve(baseTo, to, file.startsWith(baseFrom) ? path.relative(baseFrom, file) : path.basename(file))
        ),
      ),
      ...dirs.map((dir) => cp(dir, path.resolve(baseTo, to))),
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
        if ((await fs.lstat(entryAbs))?.isDirectory()) {
          dirs.push(entryAbs)

          return
        }
      } catch {}

      patterns.push(entry)
    }),
  )

  return {patterns, dirs}
}

