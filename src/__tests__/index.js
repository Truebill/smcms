import { expect } from 'chai';
import SMCMS from '../';

const { describe, it } = global;

describe('SMCMS', () => {
  it('sets backend from options', async () => {
    const smcms = new SMCMS({ backend: 'foo' });

    expect(smcms.backend).to.equal('foo');
  });
});
