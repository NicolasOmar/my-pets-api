const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prompts = require('prompts');

const runVersionUpdate = async () => {
  try {
    const { value } = await prompts({
      type: 'select',
      name: 'value',
      message: 'You are going to update this app package version. Which option you will pick?',
      choices: [
        { title: '1. Patch: Indicates small changes. Used for updates (eg. 0.0.1 -> 0.0.2)', value: 'patch' },
        { title: '2. Minor: Indicates medium changes. Used for features (eg. 0.0.2 -> 0.1.0)', value: 'minor' },
        { title: '3. Major: Indicates great changes. Used for releases (eg. 0.2.1 -> 1.0.0)', value: 'major' }
      ],
      initial: 0
    })

    const { stdout } = await exec('git log -1 --pretty=%B')
    await exec('git reset --soft HEAD~1')
    await exec(`npm version ${value} --no-git-tag-version`);
    await exec('git add package.json');
    await exec('git add coverage/coverage-final.json -f');
    await exec(`git commit -m "${stdout.trim()}" --no-verify`);
  } catch (err) {
    console.log(`Something went wrong:\n${err}`);
  }
};

runVersionUpdate();