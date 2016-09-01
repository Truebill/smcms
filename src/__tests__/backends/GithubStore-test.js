import { expect } from 'chai';
import GithubStore from '../../stores/GithubStore';

const { before, describe, it } = global;

describe('GithubStore', () => {
  it('sets rootPath', async () => {
    const store = new GithubStore({ rootPath: 'foo' });

    expect(store.config.rootPath).to.equal('foo');
  });

  it('sets auth', async () => {
    const store = new GithubStore({ username: 'foo', token: 'bar' });

    expect(store.config.token).to.equal('bar');
  });

  describe('getValue', () => {
    let store;
    before(() => {
      store = new GithubStore({
        owner: 'truebill',
        repo: 'smcms',
        rootPath: 'testContent',
      });
    });

    it('returns a value', async () => {
      const value = await store.getValue('test1.simple');
      expect(value).to.equal('Here is some **content**!');
    });

    it('returns null if file at path does not exist', async () => {
      const value = await store.getValue('test1.nothing');
      expect(value).to.be.null;
    });
  });
});
