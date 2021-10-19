import * as path from 'path';
import * as fs from 'fs';
import { AppAsset } from './asset/appAsset';

const requireFromString = require('require-from-string');

class Resolve {
  appPath: string;

  ast!: AppAsset;

  constructor({ entry }: { entry: string }) {
    this.appPath = path.resolve(process.cwd(), entry);
    const config = requireFromString(fs.readFileSync(this.appPath, { encoding: 'utf-8' }));
    // 外部构建和内部构建的差异是什么？
    this.ast = new AppAsset(null, this.appPath, config);
  }

  walk() {
    this.ast.ast.pages.forEach()
  }
}
