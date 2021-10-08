import simpleGit from 'simple-git';

export async function diff(baseDir: string, fromBranch: string, toBranch: string) {
  const git = simpleGit(baseDir, { binary: 'git', maxConcurrentProcesses: 6 });
  const diff = await git.diff([`${fromBranch}..${toBranch}`, '--name-only']);
  // console.log('diff', diff.split('\n'));
  return diff.split('\n');
}

// diff('/Users/ximing/project/youxuan/mall-wxapp', 'release/5.53.0', 'master');
