const defaultOptions = {
  renderer: value => value,
};

export default class SMCMS {
  constructor(opts) {
    const options = Object.assign({}, defaultOptions, opts);
    this.store = options.store;
    this.renderer = options.renderer;
  }

  rawValueToString(value) {
    return this.renderer(value);
  }

  getRawValue(key) {
    return this.store.getValue(key);
  }

  async getValue(key) {
    const value = await this.getRawValue(key);
    if (!value) return null;

    return this.rawValueToString(value);
  }
}
