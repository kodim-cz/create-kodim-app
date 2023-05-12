#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const spawnSync = require('cross-spawn').sync;
const yargs = require('yargs/yargs');
const { fetchKitPlan, initAppFolder, generateApp } = require('whipapp-core');

const DEFAULT_SERVER_URL = 'https://kodim-cz.github.io/kodim-starter-kits';

const argv = yargs(process.argv.slice(2))
  .command({
    command: '$0 <app_name> [kit_name]',
    desc: 'Create a starter web application',
    builder: (yargs) => yargs
      .positional('app_name', {
        describe: 'The name of your application',
        type: 'string',
      })
      .positional('kit_name', {
        desc: 'Starter kit template',
        type: 'string',
        default: 'react',
      })
      .option('s', {
        alias: 'server',
        default: DEFAULT_SERVER_URL,
        describe: 'URL from where to fetch the kit files',
        type: 'string'
      })
      .option('e', {
        alias: 'vscode',
        default: false,
        describe: 'Open created project in VS Code',
        type: 'boolean'
      })
  }).help().argv;

(async () => {
  try {
    const rootDir = path.resolve('.');
    const kitPlan = await fetchKitPlan(argv.kit_name, argv.server);
    if (kitPlan.status === 'error') {
      console.error(chalk.redBright('ERROR:', kitPlan.message));
      return;
    }

    const result = initAppFolder(rootDir, argv.app_name);
    if (result.status === 'error') {
      console.error(chalk.redBright('ERROR:', result.message));
      return;
    }

    await generateApp(result.appRoot, kitPlan);

    let packageJsonExists = false
    try {
      await fs.promises.access(path.join(result.appRoot, "package.json"), fs.constants.F_OK);
      packageJsonExists = true
    } catch {
      // package.json doesn't exist in kit - it is OK, we just don't run npm install
    }

    if (packageJsonExists) {
      console.info('Installing NPM dependencies:');
      spawnSync('npm', ['install'], { cwd: result.appRoot, stdio: 'inherit' });
    }

    console.info(chalk.green(`Project '${argv.app_name}' created successfully.`));

    if (argv.vscode) {
      console.info(chalk.green(`Opening '${argv.app_name}' in VS Code.`));
      spawnSync('code', ['.'], { cwd: result.appRoot, stdio: 'inherit' })
    }
  } catch (error) {
    console.error(chalk.redBright(`ERROR: ${error.message}`));
  }
})();
