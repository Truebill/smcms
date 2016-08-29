import { expect } from 'chai';
import GithubBackend from '../../backends/GithubBackend';

const { describe, it } = global;

describe('GithubBackend', () => {
  it('sets rootPath', async () => {
    const backend = new GithubBackend({ rootPath: 'foo' });

    expect(backend.config.rootPath).to.equal('foo');
  });
});
