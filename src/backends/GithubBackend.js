import GitHubApi from 'github';

const defaultConfig = {
  branch: 'master',
  fileSuffix: '.md',
};

export default class GithubBackend {
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

  async getValue(key) {
    const pathParts = key.split('.');
    if (this.config.rootPath) {
      pathParts.unshift(this.config.rootPath);
    }
    let path = pathParts.join('/');
    if (this.config.fileSuffix) {
      path += '.md';
    }

    let response;
    try {
      response = await this.github.repos.getContent({
        user: this.config.owner,
        repo: this.config.repo,
        path,
        ref: this.config.branch,
      });
    } catch (err) {
      if (err.code === 404) {
        return null;
      }
      throw err;
    }

    if (response.content) {
      return Buffer.from(response.content, 'base64').toString().trim();
    }

    // TODO: Figure out if/how this can happen
    console.warn('No content from github.repos.getContent for path', path);
    return null;
  }

  getValuesInNamespace() {
    throw new Error('getValuesInNamespace not yet supported for GithubBackend');
  }
}
