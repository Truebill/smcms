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

    describe('markdown preprocessor', () => {
      it('should inline relative image paths as data URIs', async () => {
        const image1 = await store.getValue('test2.relativeImage1');
        const image2 = await store.getValue('test2.relativeImage2');

        // eslint-disable-next-line max-len
        const expected = '![Cat](data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gNjUK/9sAQwALCAgKCAcLCgkKDQwLDREcEhEPDxEiGRoUHCkkKyooJCcnLTJANy0wPTAnJzhMOT1DRUhJSCs2T1VORlRAR0hF/9sAQwEMDQ0RDxEhEhIhRS4nLkVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVF/8AAEQgAMgAyAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A6KAcCrAFUnu4LOHzJ5FRR6msm/1u9a3Fxpyo0PI+Yc8Um0tyVFvY6ZRWH4nH/Hl/10rmbfxjqcJLTorDfhlK4xVzVvE1pqlnbvCG8xDkgjjJ4qHJNFKLNPQB/pOo/wDXSP8A9FrWpKK5LT9b/s28u943LIqN+IjSqt14nvpSTCQMEnaB796q5PKdfiiuOHiK+IB3J/3yaKOZBysta3qQZ43WMO+cJv5A9Tj8qi0rVZhHeC7aN4QAyeXx3wePxH5VDPbSS2TiOMPj7wPUr7H8qraYBYSyOyCRFIG1v7h9v89Kx8zoWg7UrQeYX2nLHacDJ544/E1nx28sZCKCU28+mckj9Aa6uW0vLi2S4iiSMNJkA43Ecc88D/8AVVTWbSMwQpGgDytsdF9uTj1FJSQOLepkXsb+ZII+6xrkf9c0pott2AQT5hJ5Hb/Jq3PCEv0GMRjy4zu7ZiXrWvLZyPPCtsqCIE7i2OTxnjr2HSrlKzM1FtXM1bb5R8p6etFTs06MVNqcqcHHSipuaF+ztJWskeNTI2OB1JFZt1Etu5mMbI6jDqcZX/61drYaattA6W8hiYjAPUCq2n+HZI9Xa5ubkXIIIKugA65FW4EqRl6NrdoYAsmCyL0cc/TmoNT8U2MskUMFqHnUlUZSMD68Vr+I/Ds+oBfKSCMhgd245xnpwKr2/hdknhSO0gWMyKWYSEnge49qlRsNyZSuEXTpElu4Gkimjidm6YYIoORj1H61ZvdbtPsgk2IpbOABmuqvtL+26f5bxYkUYXHOa5DT9DkTU5WCR7VbiNycp69quUbkKTWhzjXwZifU5or0ZbEbRm3izjn/ADiilyjuX4wNnSnAfu6KK1Mx8XOc8/WpoAPM6UUUMaL56IfcVzGogL4kfbxmME470UUICQ9aKKKZJ//Z)';

        expect(image1).to.equal(expected);
        expect(image2).to.equal(expected);
      });

      it('should not change absolute image URLs', async () => {
        const image = await store.getValue('test2.absoluteImage');
        expect(image).to.equal('![Cat](https://placekitten.com/50/50)');
      });
    });
  });
});
