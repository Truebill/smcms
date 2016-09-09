import DefaultRenderer from './renderers/DefaultRenderer';

export default class SMCMS {
  constructor({ store, renderer = new DefaultRenderer() }) {
    if (!store) {
      throw new Error('Missing store');
    }
    this.store = store;

    if (this.store.selfRenders) {
      this.store.setRenderer(renderer);
    }

    this.renderer = renderer;
  }

  rawValueToString(value) {
    return this.renderer(value);
  }

  getRawValue(key) {
    return this.store.getValue(key);
  }

  async getValue(key) {
    const value = await this.store.getValue(key);
    if (!value) return null;

    if (!this.store.selfRenders) {
      return this.renderer.render(value);
    }
    return value;
  }
}
