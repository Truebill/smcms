import GitHubApi from 'github';

const defaultConfig = {
  branch: 'master',
};

export default class GithubBackend {
  constructor(conf) {
    this.config = Object.assign({}, defaultConfig, conf);

    this.github = new GitHubApi({
    });

    this.github.authenticate({
      type: 'basic',
      username: this.config.username,
      password: this.config.token,
    });
  }

  getValue(key) {
    const pathParts = key.split('.');
    if (this.config.rootPath) {
      pathParts.unshift(this.config.rootPath);
    }
    const path = pathParts.join('/');

    return this.github.repos.getContent({
      user: this.config.owner,
      repo: this.config.repo,
      path,
      ref: this.config.branch,
    });
  }

  getValuesInNamespace() {
    throw new Error('getValuesInNamespace not yet supported for GithubBackend');
  }
}
