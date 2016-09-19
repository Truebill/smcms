import { expect } from 'chai';
import GithubStore from '../../stores/GithubStore';

const { before, describe, it } = global;
const GITHUB_TIMEOUT_MS = 10 * 1000;

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
      const value = await store.getValue('test1/simple.md');

      expect(value).to.equal('Here is some **content**!');
    }).timeout(GITHUB_TIMEOUT_MS);

    it('returns null if file at path does not exist', async () => {
      const value = await store.getValue('test1/nothing');

      expect(value).to.be.null;
    }).timeout(GITHUB_TIMEOUT_MS);

    it('does not decode if passed an option', async () => {
      const value = await store.getValue('test1/simple.md', { decode: null });

      expect(value).to.equal('SGVyZSBpcyBzb21lICoqY29udGVudCoqIQo=');
    }).timeout(GITHUB_TIMEOUT_MS);
  });
});
