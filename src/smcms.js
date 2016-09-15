import path from 'path';
import DefaultRenderer from './renderers/DefaultRenderer';
import MarkdownRenderer from './renderers/MarkdownRenderer';
import { getFileExtension } from './utils';

const DEFAULT_EXT_RENDERERS = {
  md: MarkdownRenderer,
};

function defaultGetRenderer(key) {
  const ext = getFileExtension(key);

  // TODO: cache renderer instances.
  return new (DEFAULT_EXT_RENDERERS[ext] || DefaultRenderer)();
}

function defaultResolveRelativePath(key, relativePath) {
  return path.join(path.dirname(key), relativePath);
}

export default class SMCMS {
  constructor({
    store,
    getRenderer = defaultGetRenderer,
    resolveRelativePath = defaultResolveRelativePath,
  }) {
    if (!store) {
      throw new Error('Missing store');
    }
    this.store = store;
    this.getRenderer = getRenderer;
    this.resolveRelativePath = resolveRelativePath;
  }

  getRawValue(key, options) {
    return this.store.getValue(key, options);
  }

  async getValue(key) {
    const value = await this.getRawValue(key);

    if (!value) return null;

    const renderer = this.getRenderer(key);
    return renderer.render(value, { key, smcms: this });
  }
}
