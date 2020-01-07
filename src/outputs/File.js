'use strict';

const fs = require('fs');
const Logger = require('../Logger');
const ERRORS = require('../ERRORS');

/**
 * File output transform
 * @param {any} issueOutput - Transformed issue
 * @param {object} config - Output config
 */
module.exports = (issues, { file } = {}) => {
  try {
    fs.writeFileSync(file, issues);
  } catch (e) {
    Logger.fatal(e, `${ERRORS.FILE_WRITE_ERROR} [${file}]`);
    return;
  }

  return issues;
};
