import GitHubApi from 'github';

const defaultConfig = {
  branch: 'master',
};

export default class GithubStore {
  constructor(conf) {
    this.config = {
      ...defaultConfig,
      ...conf,
    };

    this.github = new GitHubApi();

    if (this.config.token) {
      this.github.authenticate({
        type: 'token',
        // username: this.config.username,
        token: this.config.token,
      });
    }
  }

  static decode(content) {
    return Buffer.from(content, 'base64').toString();
  }

  async getValue(key, { decode = GithubStore.decode } = {}) {
    let path = key;

    if (this.config.rootPath) {
      path = `${this.config.rootPath}/${path}`;
    }

    let response;
    try {
      response = await this.github.repos.getContent({
        path,
        user: this.config.owner,
        repo: this.config.repo,
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
      content = (decode ? decode(content) : content).trim();

      return content;
    }

    // TODO: Figure out if/how this can happen
    // eslint-disable-next-line no-console
    console.warn('No content from github.repos.getContent for path', path);
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  getValuesInNamespace() {
    throw new Error('getValuesInNamespace not yet supported for GithubStore');
  }
}
