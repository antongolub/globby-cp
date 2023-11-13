import assert from 'node:assert'
import childProcess from 'node:child_process'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import * as tempy from 'tempy'
import fs from 'fs-extra'

import {copy} from '../../main/js/index.js'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

test('copy() abs to abs (JS API)', async (t) => {
  const temp = tempy.temporaryDirectory()
  const to = tempy.temporaryDirectory()
  const from = path.resolve(temp, 'foo.txt')

  await fs.outputFile(from, 'foo')

  await copy({from, to})
  assert.equal((await fs.readFile(path.resolve(to, 'foo.txt'))).toString().trim(), 'foo')
})

test('copy() file to file (JS API)', async (t) => {
  const temp = tempy.temporaryDirectory()
  const to = path.resolve(tempy.temporaryDirectory(), 'bar.txt')
  const from = path.resolve(temp, 'foo.txt')

  await fs.outputFile(from, 'foo')

  await copy({from, to, debug: console.log})
  assert.equal((await fs.readFile(to)).toString().trim(), 'foo')
})

test('copy() abs to abs (CLI)', async (t) => {
  const from = tempy.temporaryDirectory()
  const to = tempy.temporaryDirectory()

  await fs.outputFile(path.resolve(from, 'bar.txt'), 'bar')

  childProcess.execSync(`node ${__dirname}/../../main/js/cli.js ${from} ${to}`)
  assert.equal(await fs.readFile(path.resolve(to, 'bar.txt')), 'bar')
})

test('CLI --help', async (t) => {
  const help = childProcess.execSync(`node ${__dirname}/../../main/js/cli.js --help`).toString()
  assert.ok(help.includes('Usage:'))
})

test('CLI --version', async (t) => {
  const version = childProcess.execSync(`node ${__dirname}/../../main/js/cli.js --v`).toString()
  assert.ok(version.match(/\d+\.\d+\.\d+/))
})
