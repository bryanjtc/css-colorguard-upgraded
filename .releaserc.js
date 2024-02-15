import { readFile } from 'fs/promises';
import { join } from 'path';
import { gitmojis } from 'gitmojis';
import { createRequire } from 'module';

const template = readFile(join(__dirname, 'default-template.hbs'));
const commitTemplate = readFile(join(__dirname, 'commit-template.hbs'));
const newRequire = createRequire(import.meta.url);

export default {
  branches: ['master'],
  plugins: [
    [
      newRequire.resolve('semantic-release-gitmoji'),
      {
        releaseRules: {
          major: gitmojis.filter(({ semver }) => semver === 'major').map(({ code }) => code),
          minor: gitmojis.filter(({ semver }) => semver === 'minor').map(({ code }) => code),
          patch: gitmojis.filter(({ semver }) => semver === 'patch').map(({ code }) => code),
        },
        releaseNotes: {
          template,
          partials: { commitTemplate },
          helpers: {
            groupCommits(commits, options) {
              const allCommits = Object.values(commits).flat();
              let groupedCommits = {};

              allCommits
                .filter((commit) => commit !== undefined)
                .forEach((commit) => {
                  const gitmoji = gitmojis.find(
                    ({ emoji }) => emoji.localeCompare(commit.gitmoji) === 0
                  );

                  if (gitmoji === undefined) {
                    return;
                  }

                  groupedCommits = {
                    ...groupedCommits,
                    [gitmoji.semver]: [...(groupedCommits[gitmoji.semver] || []), commit],
                  };
                });

              return options.fn(groupedCommits);
            },
          },
        },
      },
    ],
    newRequire.resolve('@semantic-release/changelog'),
    [
      newRequire.resolve('@semantic-release/exec'),
      {
        prepareCmd:
          "yarn version ${nextRelease.version} && echo '::set-output name=version::${nextRelease.version}'",
        publishCmd: 'yarn npm publish --access public',
      },
    ],
    newRequire.resolve('semantic-release-github'),
    [
      newRequire.resolve('@semantic-release/git'),
      {
        message:
          '🚀 RELEASE: chore(release) - ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};