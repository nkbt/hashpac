# hashpac

Hash publishable NPM package content

## CLI Installation

```bash
npm install -g hashpac
```

## CLI Usage

```bash
# use current dir as npm lib
hashpac > .hashes


# specify custom npm lib dir
hashpac ~/my-npm-lib > .hashes
```


## Lib Installation

```bash
npm install -S hashpac
```

## Lib Usage

```js
const {hashpac} = require('hashpac');

console.log(hashpac({
  cwd: process.cwd(),
  packageJson: path.join(process.cwd(), 'package.json'),
  npmIgnore: path.join(process.cwd(), '.npmignore')
}))
```
