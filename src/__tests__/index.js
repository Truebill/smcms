import { expect } from 'chai';
import SMCMS from '../';

const { describe, it } = global;

const noopRenderer = v => v;
const replaceRenderer = v => v.replace(/\d+/g, '#');
const echoStore = {
  getValue: k => k,
};
const nullStore = {
  getValue: () => null,
};

describe('SMCMS', () => {
  it('sets store from options', async () => {
    const smcms = new SMCMS({ store: 'foo' });

    expect(smcms.store).to.equal('foo');
  });

  describe('getValue', () => {
    it('gets value from backend', async () => {
      const smcms = new SMCMS({
        store: echoStore,
        renderer: noopRenderer,
      });

      expect(await smcms.getValue('some value')).to.equal('some value');
    });

    it('returns null (without calling renderer) for null values', async () => {
      const smcms = new SMCMS({
        store: nullStore,
        renderer: replaceRenderer,
      });

      expect(await smcms.getValue('some key')).to.equal(null);
    });
  });
});
