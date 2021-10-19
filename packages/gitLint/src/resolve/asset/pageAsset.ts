import { Asset } from './asset';

export class PageAsset extends Asset<{ usingComponents: { [key: string]: string } }> {
  type = 'pageAsset';
  async walk() {}
}
