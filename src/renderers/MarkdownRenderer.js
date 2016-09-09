import path from 'path';
import marked from 'marked';

function fileExtension(filePath) {
  return filePath.substr(filePath.lastIndexOf('.') + 1);
}

/**
 * Replace relative image paths with a data URI of the image's contents.
 */
async function relativeImagePathsToDataURIs(imagePath, { contentPath, getContentFromPath }) {
  // Matches URLs (naively).
  const urlRegex = /^(?:[a-z]+:)?\/\//i;

  if (urlRegex.test(imagePath)) {
    return imagePath;
  }

  const absoluteImagePath = path.join(path.dirname(contentPath), imagePath);
  const imageContents = await getContentFromPath(absoluteImagePath);
  const extension = fileExtension(imagePath);

  // TODO: Inspect the contents to infer MIME type.
  return `data:image/${extension};base64,${imageContents}`;
}

const defaultConfig = {
  imagePathToUrl: relativeImagePathsToDataURIs,
  markedConf: {
    sanitize: true,
    smartypants: true,
  },
};

export default class MarkdownRenderer {
  constructor(conf) {
    this.config = {
      ...defaultConfig,
      ...conf,
    };

    marked.setOptions(this.config.markedConf);
  }

  /**
   * Takes some markdown content, and returns it with its image paths replaced (using the
   * imagePathToUrl config function).
   */
  async render(content, { contentPath, getContentFromPath } = {}) {
    if (this.config.imagePathToUrl === relativeImagePathsToDataURIs &&
    !(contentPath && getContentFromPath)) {
      throw new Error(
        'The default imagePathToUrl requires `contentPath` and `getContentFromPath` render ' +
        'options to resolve relative image content from Markdown');
    }

    // Matches markdown image tags: ![alt text](path).
    const imageRegex = /!\[.*?\]\((.+?)\)/g;

    // Map of image paths to image URLs.
    const imageUrls = {};

    // Populate image path keys.
    let tempMatch;
    do {
      tempMatch = imageRegex.exec(content);
      if (tempMatch) {
        const imagePath = tempMatch[1];
        imageUrls[imagePath] = null;
      }
    } while (tempMatch);

    // Populate image URLs using our configured imagePathToUrl function.
    await Promise.all(Object.keys(imageUrls).map(async imagePath => {
      imageUrls[imagePath] = await this.config.imagePathToUrl(imagePath, {
        contentPath,
        getContentFromPath,
      });
      return null;
    }));

    // Replace image paths in content with image URLs.
    const markdownContent = content.replace(imageRegex, (match, imagePath) => {
      const imageUrl = imageUrls[imagePath];

      if (imageUrl) {
        return match.replace(imagePath, imageUrl);
      }
      return match;
    });

    return marked(markdownContent);
  }
}
