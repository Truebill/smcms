import { expect } from 'chai';
import MarkdownRenderer from '../../renderers/MarkdownRenderer';

const { before, describe, it } = global;

const simpleMarkdown = `
# Hello world
`;
const imageMarkdown = `
foo
![Image Foo](../foo.jpg)
bar
![Image Bar](bar.jpg)
baz
`;
const urlImageMarkdown = `
![Image Foo](http://example.com/image.jpg)
`;
const prefixImagePathToUrl = imagePath => `/my-prefix/${imagePath}`;

describe('MarkdownRenderer', () => {
  before(() => {});

  it('sets imagePathToUrl', () => {
    const imagePathToUrl = () => {};
    const renderer = new MarkdownRenderer({ imagePathToUrl });

    expect(renderer.config.imagePathToUrl).to.equal(imagePathToUrl);
  });

  it('sets marked config', () => {
    const markedConf = { foo: 'bar ' };
    const renderer = new MarkdownRenderer({ markedConf });

    expect(renderer.config.markedConf).to.equal(markedConf);
  });

  describe('render', () => {
    let renderer;

    it('should render markdown as HTML', async () => {
      renderer = new MarkdownRenderer({
        imagePathToUrl: v => v,
      });

      const renderedContent = await renderer.render(simpleMarkdown);
      expect(renderedContent.trim()).to.equal('<h1 id="hello-world">Hello world</h1>');
    });

    describe('default imagePathToUrl', () => {
      before(() => {
        renderer = new MarkdownRenderer();
      });

      it('should throw when no options are provided', done => {
        // XXX: is there a better way to do this with async/await?
        renderer.render(simpleMarkdown)
          .then(() => done('No error was thrown'))
          .catch(() => done());
      });

      it('should replace image paths with data URIs', async () => {
        const renderedContent = await renderer.render(imageMarkdown, {
          contentPath: '/foo/', // Not used, but required
          getContentFromPath: () => 'SAMPLE_CONTENT',
        });

        expect(renderedContent)
          .to.contain('<img src="data:image/jpg;base64,SAMPLE_CONTENT" alt="Image Foo">')
          .and.contain('<img src="data:image/jpg;base64,SAMPLE_CONTENT" alt="Image Bar">');
      });

      it('should resolve absolute paths before getting content from path', async () => {
        const renderedContent = await renderer.render(imageMarkdown, {
          contentPath: '/base/content/path',
          getContentFromPath: v => v,
        });

        expect(renderedContent)
          .to.contain('<img src="data:image/jpg;base64,/base/foo.jpg" alt="Image Foo">')
          .and.contain('<img src="data:image/jpg;base64,/base/content/bar.jpg" alt="Image Bar">');
      });

      it('should not change full image URLs', async () => {
        const renderedContent = await renderer.render(urlImageMarkdown, {
          contentPath: '/foo/', // Not used, but required
          getContentFromPath: v => v, // Not used, but required
        });

        expect(renderedContent)
          .to.contain('<img src="http://example.com/image.jpg" alt="Image Foo">');
      });
    });

    describe('custom imagePathToUrl', () => {
      before(() => {
        renderer = new MarkdownRenderer({
          imagePathToUrl: prefixImagePathToUrl,
        });
      });

      it('should replace image paths', async () => {
        const renderedContent = await renderer.render(imageMarkdown);
        expect(renderedContent)
          .to.contain('<img src="/my-prefix/../foo.jpg" alt="Image Foo">')
          .and.contain('<img src="/my-prefix/bar.jpg" alt="Image Bar">');
      });
    });
  });
});
