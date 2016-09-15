import marked from 'marked';
import { getFileExtension, isUrl } from '../utils';

/**
 * Replace relative image paths with a data URI of the image's contents.
 */
async function relativeImagePathToDataURI(imagePath, { key, smcms }) {
  if (isUrl(imagePath)) {
    return imagePath;
  }

  const imageKey = smcms.resolveRelativePath(key, imagePath);
  const imageContent = await smcms.getRawValue(imageKey, { decode: null });
  const extension = getFileExtension(imagePath);

  // TODO: Inspect the contents to infer MIME type.
  return `data:image/${extension};base64,${imageContent}`;
}

const defaultConfig = {
  imagePathToUrl: relativeImagePathToDataURI,
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
  async render(content, { key, smcms } = {}) {
    // Matches markdown image tags: ![alt text](path).
    const imageRegex = /!\[.*?\]\((.+?)\)/g;

    // Map of image paths to URLs.
    const imageUrls = {};

    // Populate image path keys.
    let tempMatch;
    do {
      tempMatch = imageRegex.exec(content);
      if (tempMatch) {
        const imagePath = tempMatch[1];

        if (!isUrl(imagePath)) {
          imageUrls[imagePath] = imagePath;
        }
      }
    } while (tempMatch);

    if (key && smcms) {
      // Populate image URLs
      await Promise.all(Object.keys(imageUrls).map(async imagePath => {
        imageUrls[imagePath] = await this.config.imagePathToUrl(imagePath, { key, smcms });
        return null;
      }));
    }

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
