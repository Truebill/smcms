import GitHubApi from 'github';
import path from 'path';

const defaultConfig = {
  branch: 'master',
  fileSuffix: '.md',
};

function fileExtension(filePath) {
  return filePath.substr(filePath.lastIndexOf('.') + 1);
}

// Map of extensions to functions that process the content, before returning.
const valuePreprocessors = {
  // Match Markdown relative images and replace them with data URIs.
  md: async (value, objectPath, store) => {
    // Matches markdown image tags: ![alt text](path).
    const imageRegex = /!\[.*?\]\((.+?)\)/g;

    // Matches URLs (naively).
    const urlRegex = /^(?:[a-z]+:)?\/\//i;

    // Map of matched relative image paths to base64-encoded image content.
    const imageContents = {};

    // Populate image path keys.
    let tempMatch;
    do {
      tempMatch = imageRegex.exec(value);
      if (tempMatch) {
        const imagePath = tempMatch[1];

        if (!urlRegex.test(imagePath)) {
          imageContents[imagePath] = null;
        }
      }
    } while (tempMatch);

    // Fetch image content.
    await Promise.all(Object.keys(imageContents).map(async relativeImagePath => {
      const absoluteImagePath = path.join(path.dirname(objectPath), relativeImagePath);
      imageContents[relativeImagePath] = await store.getValueFromPath(absoluteImagePath, false);
      return null;
    }));

    // Replace relative paths with image data URIs.
    return value.replace(imageRegex, (match, imagePath) => {
      const contents = imageContents[imagePath];
      if (contents) {
        const extension = fileExtension(imagePath);
        // TODO: should really be inspecting the contents to infer MIME type.
        const dataURI = `data:image/${extension};base64,${contents}`;
        return match.replace(imagePath, dataURI);
      }
      return match;
    });
  },
};

export default class GithubStore {
  constructor(conf) {
    this.config = Object.assign({}, defaultConfig, conf);

    this.github = new GitHubApi({
    });

    if (this.config.token) {
      this.github.authenticate({
        type: 'token',
        // username: this.config.username,
        token: this.config.token,
      });
    }
  }

  async getValueFromPath(objectPath, decode = true) {
    let response;
    try {
      response = await this.github.repos.getContent({
        user: this.config.owner,
        repo: this.config.repo,
        path: objectPath,
        ref: this.config.branch,
      });
    } catch (err) {
      if (err.code === 404) {
        return null;
      }
      throw err;
    }

    if (response.content) {
      const value = decode ? Buffer.from(response.content, 'base64').toString().trim() :
        response.content;

      const valuePreprocessor = valuePreprocessors[fileExtension(objectPath)];
      const processedValue = valuePreprocessor ?
        await valuePreprocessor(value, objectPath, this) : value;
      return processedValue;
    }

    // TODO: Figure out if/how this can happen
    console.warn('No content from github.repos.getContent for path', objectPath);
    return null;
  }

  async getValue(key) {
    const pathParts = key.split('.');
    if (this.config.rootPath) {
      pathParts.unshift(this.config.rootPath);
    }

    let objectPath = pathParts.join('/');
    if (this.config.fileSuffix) {
      objectPath += this.config.fileSuffix;
    }

    return await this.getValueFromPath(objectPath);
  }

  getValuesInNamespace() {
    throw new Error('getValuesInNamespace not yet supported for GithubStore');
  }
}
