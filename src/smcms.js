const defaultOptions = {};

export default class SMCMS {
  constructor(opts) {
    const options = Object.assign({}, defaultOptions, opts);
    this.backend = options.backend;
  }
}
