#!/usr/bin/env node
require('dotenv').config();
const program = require('commander');
const index = require('./index');
const packageConfig = require('../package.json');

program
  .name(packageConfig.name)
  .version(packageConfig.version, '-v, --version')
  .description('isren - ISsue Rendering ENgine')
  .arguments('<hosted_git_url>')
  .option('-a, --auth <token>', 'Hosted git API authentication token')
  .option('-k, --insecure', 'Ignore SSL certificate check')
  .option('-d, --debug', 'Enable debug mode')
  .option(
    '-t, --transform <transform file path>',
    'Path to custom transform file'
  )
  .option('-o, --out <Output file format>', 'The format of output file')
  .option(
    '--out-options <Output options>',
    'Additional options for output configuration'
  )
  .option(
    '--issue-options <Issue options>',
    'Additional options for the Issue pulling'
  )
  .option('-f, --file <Output file path>', 'The path of output file')
  .action((...args) =>
    index(...args)
      .then(() => process.exit(0))
      .catch(console.error)
  )
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  console.log(
    'Incomplete information provided, see --help for instructions on how to use isren'
  );
}
