import { Asset } from './asset';

type subpackage = {
  root: string;
  pages: string[];
};

type appAst = {
  pages: string[];
  subpackages: subpackage[];
  subPackages: subpackage[];
  window: { [key: string]: string };
  tabBar: {
    color?: string;
    selectedColor?: string;
    backgroundColor?: string;
    borderStyle?: string;
    list: { pagePath: string; text: string; iconPath: string; selectedIconPath: string }[];
  };
};
export class AppAsset extends Asset<appAst> {
  type = 'appAsset';

  // constructor(parent: Asset | null, path: string, ast: appAst) {
  //   super(parent, path, ast);
  //   // this.siblingAssets =
  // }

  async walk() {
    this.resolveSibling();
    await Promise.all(this.ast.pages.map((page) => {}));
  }
}
