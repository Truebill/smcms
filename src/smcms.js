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
    this.renderer(value);
  }

  getRawValue(key) {
    return this.store.getValue(key);
  }

  getValue(key) {
    return this.rawValueToString(this.getRawValue(key));
  }
}
