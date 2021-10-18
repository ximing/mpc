import globby from 'globby';
import fs from 'fs';

const escomplex = require('typhonjs-escomplex');

const path = process.argv[2];
if (path) {
  const files = globby.sync([path]);
  const source = files.map((f) => ({
    filePath: f,
    srcPath: f,
    code: fs.readFileSync(f, 'utf8'),
  }));
  const result = escomplex.analyzeProject(
    source,
    {},
    {
      plugins: ['typescript','decorators-legacy'],
    }
  );
  console.log(result.moduleAverage.maintainability);
}
