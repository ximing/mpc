import * as path from 'path';
import config from '../../config';

let id = 0;

export class Asset<A = any> {
  children: Array<Asset> = [];
  ast: A;
  id: number = 0;
  parent: Asset | null = this;
  path: string;
  siblingAssets: Map<string, Asset> = new Map();

  constructor(parent: Asset | null, path: string, ast: A) {
    this.parent = parent;
    this.id = ++id;
    this.ast = ast;
    this.path = path;
  }

  walk() {
    throw new Error('walk not implemented');
  }

  resolveSibling() {
    const { name } = path.parse(this.path);
    this.siblingAssets.
    config.exts.js;
    this.path;
  }
}
