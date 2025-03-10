const fs = require('fs');
const { exec } = require('child_process');

if (process.argv[2] === '--modules') {
  if (fs.existsSync('packages/direflow-component/node_modules')) {
    exec('rm -rf packages/direflow-component/node_modules', (err) => {
      if (err) {
        console.log('✗ packages/direflow-component/node_modules FAILED to remove');
        console.log(err);
        return;
      }

      console.log('✓ packages/direflow-component/node_modules is REMOVED');
    });
  }

  return;
}

cleanDeps('.');

if (!fs.existsSync('packages')) {
  return;
}

const widgetsDirectory = fs.readdirSync('packages');

// eslint-disable-next-line no-restricted-syntax
for (const directory of widgetsDirectory) {
  if (fs.statSync(`packages/${directory}`).isDirectory()) {
    cleanDeps(`packages/${directory}`);
  }
}

if (!fs.existsSync('cypress/test-setup')) {
  return;
}

if (!fs.statSync('cypress/test-setup').isDirectory()) {
  return;
}

cleanDeps('cypress/test-setup');

function cleanDeps(dir) {
  console.log('Beginning to clean:', dir);

  if (fs.existsSync(`${dir}/node_modules`)) {
    exec(`rm -rf ${dir}/node_modules`, (err) => {
      if (err) {
        console.log(`✗ ${dir}/node_modules FAILED to remove`);
        console.log(err);
        return;
      }

      console.log(`✓ ${dir}/node_modules is REMOVED`);
    });
  }

  if (fs.existsSync(`${dir}/npm yarn.lock`)) {
    exec(`rm ${dir}/npm yarn.lock`, (err) => {
      if (err) {
        console.log(`✗ ${dir}/npm yarn.lock FAILED to remove`);
        console.log(err);
        return;
      }

      console.log(`✓ ${dir}/npm yarn.lock is REMOVED`);
    });
  }

  if (fs.existsSync(`${dir}/package-lock.json`)) {
    exec(`rm ${dir}/package-lock.json`, (err) => {
      if (err) {
        console.log(`✗ ${dir}/package-lock.json FAILED to remove`);
        console.log(err);
        return;
      }

      console.log(`✓ ${dir}/package-lock.json is REMOVED`);
    });
  }

  if (fs.existsSync(`${dir}/tsconfig.lib.json`)) {
    exec(`rm ${dir}/tsconfig.lib.json`, (err) => {
      if (err) {
        console.log(`✗ ${dir}/tsconfig.lib.json FAILED to remove`);
        console.log(err);
        return;
      }

      console.log(`✓ ${dir}/tsconfig.lib.json is REMOVED`);
    });
  }

  if (fs.existsSync(`${dir}/dist`)) {
    exec(`rm -rf ${dir}/dist`, (err) => {
      if (err) {
        console.log(`✗ ${dir}/dist FAILED to remove`);
        console.log(err);
        return;
      }

      console.log(`✓ ${dir}/dist is REMOVED`);
    });
  }
}
