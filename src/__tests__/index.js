import { expect } from 'chai';
import SMCMS from '../';

const { describe, it } = global;

describe('SMCMS', () => {
  it('sets store from options', async () => {
    const smcms = new SMCMS({ store: 'foo' });

    expect(smcms.store).to.equal('foo');
  });
});
