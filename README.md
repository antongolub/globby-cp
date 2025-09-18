# globby-cp
> [globby](https://github.com/sindresorhus/globby)-boosted file copying util

[![Release](https://github.com/antongolub/globby-cp/workflows/CI/badge.svg)](https://github.com/antongolub/globby-cp/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/4d17420020d4196ad5a2/maintainability)](https://codeclimate.com/github/antongolub/globby-cp/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/4d17420020d4196ad5a2/test_coverage)](https://codeclimate.com/github/antongolub/globby-cp/test_coverage)

## Install
```sh
yarn add globby-cp
```

## Usage
### CLI
```shell
globby-cp src/*.js dist/
npx globby-cp ./* ./foo/bar --ignore-files .gitignore
```

| Option                 | Description                                        | Default         |
|------------------------|----------------------------------------------------|-----------------|
| `--base-from`          | Base dir for `from` pattern                        | `process.cwd()` |
| `--base-to`            | Base dir for `to` argument                         | `process.cwd()` |
| `--ignore-files`, `-i` | Path to ignoreFile (like .gitignore or .npmignore) |                 |
| `--version -v`         | Print version                                      |                 |
| `--help -h`            | Show help                                          |                 |

### JS API
```js
import {copy} from 'globby-cp'

await copy({
  from:       'src/**/*.js',
  to:         'dist/',
  baseFrom,   // process.cwd()
  baseTo,     // process.cwd(),
  debug,      // () => {}
  ignoreFiles // undefined
  // ...rest Partial<import('globby').Options>
})
```

### globby-cp + git
https://github.com/antongolub/git-glob-cp

## License
[MIT](./LICENSE)
