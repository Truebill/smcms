import { expect } from 'chai';
import MarkdownRenderer from '../../renderers/MarkdownRenderer';

const MOCK_RENDER_OPTIONS = {
  key: 'KEY',
  smcms: {
    getRawValue: imageKey => `${imageKey}|RAW_VALUE`,
    resolveRelativePath: (key, imagePath) => `${key}|${imagePath}`,
  },
};

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
      renderer = new MarkdownRenderer();

      const renderedContent = await renderer.render(simpleMarkdown);
      expect(renderedContent.trim()).to.equal('<h1 id="hello-world">Hello world</h1>');
    });

    describe('default imagePathToUrl', () => {
      before(() => {
        renderer = new MarkdownRenderer();
      });

      it('should not be used when options are missing', async () => {
        const renderedContent = await renderer.render(imageMarkdown);

        expect(renderedContent)
          .to.contain('src="../foo.jpg"')
          .and.contain('src="bar.jpg"');
      });

      it('should replace image paths with data URIs', async () => {
        const renderedContent = await renderer.render(imageMarkdown, MOCK_RENDER_OPTIONS);

        const url1 = 'data:image/jpg;base64,KEY|../foo.jpg|RAW_VALUE';
        const url2 = 'data:image/jpg;base64,KEY|bar.jpg|RAW_VALUE';

        expect(renderedContent)
          .to.contain(`<img src="${url1}" alt="Image Foo">`)
          .and.contain(`<img src="${url2}" alt="Image Bar">`);
      });

      it('should not change full image URLs', async () => {
        const renderedContent = await renderer.render(urlImageMarkdown, MOCK_RENDER_OPTIONS);

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
        const renderedContent = await renderer.render(imageMarkdown, MOCK_RENDER_OPTIONS);
        expect(renderedContent)
          .to.contain('<img src="/my-prefix/../foo.jpg" alt="Image Foo">')
          .and.contain('<img src="/my-prefix/bar.jpg" alt="Image Bar">');
      });
    });
  });
});
