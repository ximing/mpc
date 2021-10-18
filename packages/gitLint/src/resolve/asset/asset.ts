let id = 0;
export class Asset {
  children: Array<Asset> = [];
  ast: any = {};
  id: number = 0;
  parent: Asset | null = this;
  path: string;
  siblingAssets: Map<string, Asset> = new Map();

  constructor(parent: Asset, path: string, ast: any) {
    this.parent = parent;
    this.id = ++id;
    this.ast = ast;
    this.path = path;
  }
}
