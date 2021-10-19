import got from 'got';
import fs from 'fs';
import path from 'path';
import { calcStrLen } from './utils';

let comboCount = 0;

export class Analyzer {
  comboData: {
    nodes: { id: string; label: string; comboId?: string; size?: number[] | number }[];
    edges: { source: string; target: string }[];
    combos: { id: string; label: string; style?: any }[];
  } = {
    nodes: [],
    edges: [],
    combos: [],
  };

  root!: string;

  graph: any;

  async start(url: string, page: string) {
    let content: any = {};
    if (url.startsWith('http')) {
      content = await got(url).json();
    } else {
      content = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), url), 'utf8'));
    }
    let { root, graph } = content;
    this.root = root;
    this.graph = graph;
    this.walk(page, null);
    let html = fs.readFileSync(path.join(__dirname, './index.html'), 'utf8');
    html = html.replace('$data$', JSON.stringify(this.comboData));
    fs.writeFileSync('./dist.html', html);
    fs.writeFileSync('./dist.json', JSON.stringify(this.comboData));
  }

  walk(confPath: string, parentConfPath: string | null) {
    const pagePath = confPath.startsWith(this.root) ? confPath : path.join(this.root, confPath);
    const pageNode = this.graph[pagePath];
    if (!pageNode) {
      console.error(pagePath);
      process.exit(100);
    }
    const { resolvedDeps, resolvedOtherFiles, originFilename, fileType } = pageNode;
    const parentPath = originFilename;
    const comboId = `${comboCount++}`;
    if (this.comboData.nodes.find((item) => item.id === originFilename)) {
      return;
    }
    // if (parentConfPath) {
    //   this.comboData.edges.push({
    //     source: parentConfPath,
    //     target: originFilename,
    //   });
    // }
    // 处理节点
    this.comboData.nodes.push({
      id: originFilename,
      label: fileType,
      size: [calcStrLen(originFilename.replace(this.root, '')).len * 6, 30],
      comboId,
    });
    this.comboData.combos.push({
      id: comboId,
      label: originFilename.replace(this.root, ''),
      style: {
        stroke: '#99C0ED',
        fill: '#99C0ED',
      },
    });
    // @ts-ignore
    Object.values(resolvedDeps).forEach((v: string) => {
      if (fileType === 'conf') {
        this.walk(v, parentPath);
      } else {
        this.walkFile(v, parentPath);
      }
    });
    if (fileType === 'conf') {
      // 处理依赖文件
      Object.keys(resolvedOtherFiles).forEach((filePath) => {
        const fileNode = this.graph[filePath];
        // @ts-ignore
        const { resolvedDeps, originFilename, fileType } = fileNode;
        this.comboData.nodes.push({
          id: originFilename,
          label: fileType,
          comboId,
        });
        // 处理边
        this.comboData.edges.push({ source: parentPath, target: originFilename });
        // 处理页面或者组件组成文件所依赖的资源
        // @ts-ignore
        Object.values(resolvedDeps).forEach((v: string) => this.walkFile(v, originFilename));
      });
    }
  }

  walkFile = (filePath: string, parent: string) => {
    const fileNode = this.graph[filePath];
    const { resolvedDeps, originFilename } = fileNode;
    this.comboData.edges.push({ source: parent, target: originFilename });
    if (!this.comboData.nodes.find((item) => item.id === originFilename)) {
      this.comboData.nodes.push({
        id: originFilename,
        label: originFilename.replace(this.root, ''),
        size: [calcStrLen(originFilename.replace(this.root, '')).len * 6, 30],
      });
      // @ts-ignore
      Object.values(resolvedDeps).forEach((v: string) => this.walkFile(v, originFilename));
    }
  };
}

new Analyzer().start(
  './a.json.log',
  '/projects/grocery-c-mp-exhibition/src/pages/maicai/index.json'
);
