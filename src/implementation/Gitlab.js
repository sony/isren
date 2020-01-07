'use strict';

const { URL } = require('url');
const { Gitlab: Git } = require('gitlab');
const Implementation = require('./index');
const Logger = require('../Logger');
const ERRORS = require('../ERRORS');

module.exports = class GitLab extends Implementation {
  /**
   * GitLab implementation constructor.
   *
   * @param {string} url
   *   Full Project URL
   */

  constructor(url, cmd) {
    super('GitLab', url, cmd);
  }

  /**
   * Determine if the input url matches the GitLab domain regex
   *
   * @param {String} url
   *   The url to test
   *
   * @return {boolean}
   *   Whether or not the input url matches this implementation.
   */
  static isImplementation(url) {
    const { GITLAB_URL } = process.env;
    const regex = new RegExp(GITLAB_URL, 'ig');

    if (/(\/|^)gitlab\.com[/]/gi.test(url)) return true;
    if (GITLAB_URL && regex.test(url)) return true;

    return false;
  }

  /**
   * Break the input url into the correct parts
   *
   * @param {String} url
   *   The input url to parse.
   *
   * @return {Array} out
   *   out[0] - the input url pathnam
   *   out[1] - the url host with protocol
   */
  static parseURL(url) {
    const { protocol, host, pathname } = new URL(url);
    const fullHost = `${protocol}//${host}`;
    console.log(`Connecting to ${fullHost}...`);

    return [pathname, fullHost];
  }

  async authenticate() {
    const [path, host] = GitLab.parseURL(this.url);
    const api = new Git({
      token: this.auth,
      host
    });
    const [, groups, group] = path.split('/');

    // Determine what type of url we have.
    let projectName, groupName;
    if (/groups/gi.test(groups)) {
      groupName = group;
    } else {
      groupName = groups;
      projectName = group;
    }

    try {
      if (projectName !== undefined) {
        const [currentProject] = (
          await api.Projects.search(projectName)
        ).filter(projectInfo => projectInfo.web_url.includes(path));
        const projectId = currentProject.id;
        console.log(
          `Authentication success! Current project is ${path}(#${projectId})`
        );
        return { api, projectId };
      }

      const [currentGroup] = (
        await api.Groups.search(groupName)
      ).filter(groupInfo => groupInfo.web_url.includes(path));
      const groupId = currentGroup.id;
      console.log(
        `Authentication success! Current group is ${path}(#${groupId})`
      );
      return { api, groupId };
    } catch (e) {
      if (e.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
        return Logger.fatal(e, ERRORS.SSL_ERROR);
      }

      return Logger.fatal(e, ERRORS.AUTH_ERROR);
    }
  }

  /**
   * Get the issues for the current git implementation.
   *
   * @param {Object} config
   *   config.api - The git API instance
   *   config.projectId - The current projectId
   *   config.groupId - The current groupId
   *
   * @returns {Array}
   *   The list of issues.
   */
  async getIssues({ api, projectId, groupId, options = {} }) {
    let issues;
    if (projectId) {
      issues = await api.Issues.all({
        projectId,
        ...options
      });
    }
    if (groupId) {
      issues = await api.Issues.all({
        groupId,
        ...options
      });
    }

    // Basic error handling for the api return type.
    if (!Array.isArray(issues)) {
      return Logger.fatal(new Error(ERRORS.MISSING_ISSUES));
    }

    return this.addProjectNames(api, issues);
  }

  /**
   * Update the input issues to include the project name.
   *
   * @param {Object} api
   *   The api object to use.
   * @param {Array} issues
   *   The input issues to modify
   *
   * @return {Promise<*>}
   */
  async addProjectNames(api, issues) {
    if (!api) {
      return Logger.fatal(
        `${ERRORS.INVALID_PARAMETERS} addProjectNames (api: ${api})`
      );
    }
    if (!issues || !(issues instanceof Array)) {
      return Logger.fatal(
        `${ERRORS.INVALID_PARAMETERS} addProjectNames (issues: ${issues})`
      );
    }

    const projects = (await api.Projects.all()).reduce(
      (acc, cur) => Object.assign(acc, { [cur.id]: cur.path_with_namespace }),
      {}
    );

    return issues.map(issue => {
      issue.project_name = projects[issue.project_id] || '';
      return issue;
    });
  }
};
