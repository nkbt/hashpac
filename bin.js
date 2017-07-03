#!/usr/bin/env node


const {hashpac} = require('.');


const [cwd = process.cwd()] = process.argv.slice(2);


console.log(hashpac({cwd}));
