'use strict';

const GitLab = require('./implementation/Gitlab');
const Logger = require('./Logger');
const Output = require('./Output.js');
const { DEBUG, OUT_OPTIONS, ISSUE_OPTIONS } = process.env;
const { parseJSON } = require('./Util');

module.exports = async (url, cmd) => {
  // Configure the log debugger mode
  if (cmd.debug || DEBUG === '1' || (DEBUG && DEBUG.toLowerCase() === 'true')) {
    Logger.debugMode = true;
  }

  // Convert the cli input outOptions to an object
  try {
    cmd.outOptions = parseJSON(cmd.outOptions || OUT_OPTIONS || {});
  } catch (e) {
    Logger.fatal(`Malformed --out-options given: ${e.message || e.toString()}`);
  }

  try {
    cmd.issueOptions = parseJSON(cmd.issueOptions || ISSUE_OPTIONS || {});
  } catch (e) {
    Logger.fatal(
      `Malformed --issue-options given: ${e.message || e.toString()}`
    );
  }

  // Configure the git implementation.
  let git;
  if (GitLab.isImplementation(url)) {
    git = new GitLab(url, cmd);
  }

  if (!git) {
    return Logger.fatal(
      new Error(`No git implementation was found for the given url: ${url}`)
    );
  }

  return git
    .authenticate()
    .then((...args) =>
      git.getIssues(Object.assign({}, ...args, { options: cmd.issueOptions }))
    )
    .then((...args) => git.transform(...args))
    .then(issues => Output(issues, cmd))
    .catch((...args) => Logger.fatal(...args));
};
