const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
const ignore = require('ignore');


const escapeRegExp = str => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");


const NPM_FILES = [
  'package.json',
  'README',
  'CHANGES',
  'CHANGELOG',
  'HISTORY',
  'LICENSE',
  'LICENCE',
  'NOTICE'
];


const NPM_IGNORE = [
  '.git',
  'CVS',
  '.svn',
  '.hg',
  '.lock-wscript',
  '.wafpickle-N',
  '.*.swp',
  '.DS_Store',
  '._*',
  'npm-debug.log',
  '.npmrc',
  'node_modules',
  'config.gypi',
  '*.orig',
  'package-lock.json'
];


const whitelist = ({packageJson}) => {
  const {files, main} = require(packageJson);

  if (!files) {
    return allFiles => allFiles;
  }

  if (main) {
    files.push(main)
  }

  files.push.apply(files, NPM_FILES);

  const regexes = files.map(f => new RegExp(`^${escapeRegExp(f)}`));

  return allFiles => allFiles
    .filter(({file}) => regexes.some(r => r.exec(file)));
};


const getGitFiles = ({cwd}) => execSync(`git ls-files -s --abbrev=8`, {cwd, stdio: 'pipe'})
  .toString().trim()
  .split('\n')
  .map(line => {
    const [mode, object, stage, file] = line.split(/\s+/);
    return {mode, object, stage, file};
  });


const encodeGitFiles = files => files
  .map(({mode, object, stage, file}) => [mode, object, stage, file].join(' '))
  .join('\n');


exports.hashSync = ({
  cwd = process.cwd(),
  packageJson = path.join(cwd, 'package.json'),
  npmIgnore = path.join(cwd, '.npmignore')
} = {}) => {
  const gitFiles = getGitFiles({cwd});
  const whitelisted = whitelist({packageJson})(gitFiles);

  const ig = ignore();
  ig.add(NPM_IGNORE);
  try {
    ig.add(fs.readFileSync(npmIgnore, 'utf-8'));
  } catch (err) {
    return encodeGitFiles(whitelisted);
  }

  const notBlacklisted = whitelisted
    .filter(({file}) => !ig.ignores(file));

  return encodeGitFiles(notBlacklisted);
};
