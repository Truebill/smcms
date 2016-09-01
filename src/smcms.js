const defaultOptions = {};

export default class SMCMS {
  constructor(opts) {
    const options = Object.assign({}, defaultOptions, opts);
    this.store = options.store;
  }

  getValue(key) {
    return this.store.getValue(key);
  }
}
