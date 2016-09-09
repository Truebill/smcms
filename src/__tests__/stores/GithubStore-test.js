import { expect } from 'chai';
import GithubStore from '../../stores/GithubStore';

const { before, describe, it } = global;
const noOpRenderer = {
  render: v => v,
};

describe('GithubStore', () => {
  it('sets rootPath', async () => {
    const store = new GithubStore({ rootPath: 'foo' });

    expect(store.config.rootPath).to.equal('foo');
  });

  it('sets auth', async () => {
    const store = new GithubStore({ username: 'foo', token: 'bar' });

    expect(store.config.token).to.equal('bar');
  });

  it('should selfRender', () => {
    const store = new GithubStore();

    expect(store.selfRenders).to.be.true;
  });

  it('should enable setting renderer', () => {
    const store = new GithubStore();
    store.setRenderer(noOpRenderer);

    expect(store.renderer).to.equal(noOpRenderer);
  });

  describe('getValue', () => {
    let store;
    before(() => {
      store = new GithubStore({
        owner: 'truebill',
        repo: 'smcms',
        rootPath: 'testContent',
      });
      store.setRenderer(noOpRenderer);
    });

    it('returns a value', async () => {
      const value = await store.getValue('test1.simple');
      expect(value.trim()).to.equal('Here is some **content**!');
    });

    it('returns null if file at path does not exist', async () => {
      const value = await store.getValue('test1.nothing');
      expect(value).to.be.null;
    });
  });
});
