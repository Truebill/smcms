import { expect } from 'chai';
import GithubStore from '../../backends/GithubStore';

const { before, describe, it } = global;

describe('GithubStore', () => {
  it('sets rootPath', async () => {
    const backend = new GithubStore({ rootPath: 'foo' });

    expect(backend.config.rootPath).to.equal('foo');
  });

  it('sets auth', async () => {
    const backend = new GithubStore({ username: 'foo', token: 'bar' });

    expect(backend.config.token).to.equal('bar');
  });

  describe('getValue', () => {
    let backend;
    before(() => {
      backend = new GithubStore({
        owner: 'truebill',
        repo: 'smcms',
        rootPath: 'testContent',
      });
    });

    it('returns a value', async () => {
      const value = await backend.getValue('test1.simple');
      expect(value).to.equal('Here is some **content**!');
    });

    it('returns null if file at path does not exist', async () => {
      const value = await backend.getValue('test1.nothing');
      expect(value).to.be.null;
    });
  });
});
