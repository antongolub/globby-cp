#!/usr/bin/env node

import { createRequire } from 'node:module'
import minimist from 'minimist'
import {copy} from './index.js'

const camelize = s => s.replace(/-./g, x => x[1].toUpperCase())
const normalizeFlags = (flags = {}) => Object.entries(flags).reduce((acc, [k, v]) => ({...acc, [camelize(k)]: v}), {})
const argv = normalizeFlags(minimist(process.argv.slice(2)))

if (argv.help || argv.h) {
  console.log(`
  Usage:
    gcp <from> <to> [options]
    
  Options:
    --ignore-files -i   Path to ignore files (like .gitignore or .npmignore)
    --base-from         Base dir for 'from' pattern. Defaults to process.cwd()
    --base-to           Base dir for 'to' pattern. Defaults to process.cwd()
    --version -v        Show version
    --help -h           Show help

  Examples:
    gcp ./* /foo/bar --ignore-files .gitignore
    gcp ./src/main/ts/**/*.ts ./target/ts
`)
  process.exit(0)
}

if (argv.v || argv.version) {
  console.log(createRequire(import.meta.url)('../../../package.json').version)
  process.exit(0)
}

await copy({
  from:         argv._[0],
  to:           argv._[1],
  baseFrom:     argv.baseFrom,
  baseTo:       argv.baseTo,
  ignoreFiles:  argv.i || argv.ignoreFiles
}).then(
  () => process.exit(0),
  err => {
    console.error(err)
    process.exit(1)
  }
)
