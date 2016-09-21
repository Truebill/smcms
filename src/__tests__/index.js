import { expect } from 'chai';
import SMCMS from '../';
import DefaultRenderer from '../renderers/DefaultRenderer';
import MarkdownRenderer from '../renderers/MarkdownRenderer';

const { before, describe, it } = global;

const fooRenderer = {
  render: () => 'foo',
};
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

  it('sets getRenderer from options', async () => {
    const getRenderer = () => {};
    const smcms = new SMCMS({ store: 'foo', getRenderer });

    expect(smcms.getRenderer).to.equal(getRenderer);
  });

  it('sets resolveRelativePath from options', async () => {
    const resolveRelativePath = () => {};
    const smcms = new SMCMS({ store: 'foo', resolveRelativePath });

    expect(smcms.resolveRelativePath).to.equal(resolveRelativePath);
  });

  it('should throw if no store is set', () => {
    const create = () => new SMCMS({ renderer: 'baz' });

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
      });

      expect(await smcms.getValue('some key')).to.equal(null);
    });

    it('should use custom renderer', async () => {
      const smcms = new SMCMS({
        store: echoStore,
        getRenderer: () => fooRenderer,
      });

      expect(await smcms.getValue('some key')).to.equal('foo');
    });
  });

  describe('getRawValue', () => {
    it('should not call renderer', async () => {
      const smcms = new SMCMS({
        store: echoStore,
        getRenderer: () => fooRenderer,
      });

      expect(await smcms.getRawValue('some key')).to.equal('some key');
    });
  });

  describe('default getRenderer', () => {
    let smcms;

    before(() => {
      smcms = new SMCMS({
        store: echoStore,
      });
    });

    it('returns the Markdown renderer for .md files', () => {
      const renderer = smcms.getRenderer('foo.md');

      expect(renderer).to.be.an.instanceof(MarkdownRenderer);
    });

    it('returns the Default renderer for unknown files', () => {
      const renderer = smcms.getRenderer('foo.asdf');

      expect(renderer).to.be.an.instanceof(DefaultRenderer);
    });
  });
});
