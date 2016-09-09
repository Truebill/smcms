import GitHubApi from 'github';

const defaultConfig = {
  branch: 'master',
  fileSuffix: '.md',
};

export default class GithubStore {
  constructor(conf) {
    this.config = {
      ...defaultConfig,
      ...conf,
    };

    this.selfRenders = true;

    this.github = new GitHubApi();

    if (this.config.token) {
      this.github.authenticate({
        type: 'token',
        // username: this.config.username,
        token: this.config.token,
      });
    }
  }

  setRenderer(renderer) {
    this.renderer = renderer;
  }

  async getContentFromPath(contentPath, { decode = false, render = false } = {}) {
    let response;
    try {
      response = await this.github.repos.getContent({
        user: this.config.owner,
        repo: this.config.repo,
        path: contentPath,
        ref: this.config.branch,
      });
    } catch (err) {
      if (err.code === 404) {
        return null;
      }
      throw err;
    }

    let { content } = response;

    if (content) {
      content = (decode ? Buffer.from(content, 'base64').toString() : content).trim();

      if (render) {
        return this.renderer.render(content, {
          contentPath,
          getContentFromPath: this.getContentFromPath.bind(this),
        });
      }
      return content;
    }

    // TODO: Figure out if/how this can happen
    // eslint-disable-next-line no-console
    console.warn('No content from github.repos.getContent for path', contentPath);
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

    return await this.getContentFromPath(objectPath, { decode: true, render: true });
  }

  // eslint-disable-next-line class-methods-use-this
  getValuesInNamespace() {
    throw new Error('getValuesInNamespace not yet supported for GithubStore');
  }
}
