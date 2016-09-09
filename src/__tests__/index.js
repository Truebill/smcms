import { expect } from 'chai';
import SMCMS from '../';

const { describe, it } = global;

const replaceRenderer = {
  render: v => v.replace(/\d+/g, '#'),
};
const fooRenderer = {
  render: () => 'foo',
};
const echoStore = {
  getValue: k => k,
};
const selfRenderingEchoStore = {
  getValue: k => k,
  selfRenders: true,
  setRenderer: () => {},
};
const nullStore = {
  getValue: () => null,
};

describe('SMCMS', () => {
  it('sets store from options', async () => {
    const smcms = new SMCMS({ store: 'foo' });

    expect(smcms.store).to.equal('foo');
  });

  it('sets renderer from options', async () => {
    const smcms = new SMCMS({ store: 'foo', renderer: 'bar' });

    expect(smcms.renderer).to.equal('bar');
  });

  it('should throw if no store is set', () => {
    const create = () => new new SMCMS({ renderer: 'baz' });

    expect(create).to.throw(Error);
  });

  describe('getValue', () => {
    it('gets value from backend', async () => {
      const smcms = new SMCMS({
        store: echoStore,
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

    it('should use custom renderer', async () => {
      const smcms = new SMCMS({
        store: echoStore,
        renderer: fooRenderer,
      });

      expect(await smcms.getValue('some key')).to.equal('foo');
    });

    it('should not use renderer when store self-renders', async () => {
      const smcms = new SMCMS({
        store: selfRenderingEchoStore,
        renderer: fooRenderer,
      });

      expect(await smcms.getValue('some value')).to.equal('some value');
    });
  });
});
