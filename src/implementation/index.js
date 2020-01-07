'use strict';

const path = require('path');
const vm = require('vm');
const fs = require('fs');
const Logger = require('../Logger');
const ERRORS = require('../ERRORS');
const { AUTH } = process.env;
const { normalizeOutput } = require('../Util');

module.exports = class Implementation {
  constructor(name = 'UNKNOWN IMPLEMENTATION', url = '', cmd = {}) {
    this.name = name;
    this.url = url;
    this.cmd = cmd;
    this.auth = this.cmd.auth || AUTH;

    // Output type normalization from string to array of strings.
    this.cmd.out = normalizeOutput(this.cmd.out);

    if (this.cmd.file && !this.cmd.out.includes('file')) {
      return Logger.fatal(ERRORS.MISSING_FILE_OUT);
    }

    if (!this.cmd.file && this.cmd.out.includes('file')) {
      return Logger.fatal(ERRORS.FILE_TRANSFORM_NAME);
    }

    // Note: The `rejectUnauthorized` parameter is not working, this is a
    // temporary work-around
    if (this.cmd.insecure) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    }

    if (!this.url) {
      return Logger.fatal(ERRORS.EMPTY_URL);
    }

    if (!this.auth) {
      return Logger.fatal(ERRORS.MISSING_AUTH);
    }
  }

  static isImplementation() {
    return Logger.fatal(ERRORS.NYI_IS_IMPLEMENTATION);
  }

  getIssues() {
    return Logger.fatal(`${ERRORS.NYI_GET_ISSUES} ${this.name}`);
  }

  authenticate() {
    return Logger.fatal(`${ERRORS.NYI_AUTHENTICATE} ${this.name}`);
  }

  transform(issues) {
    if (!this.cmd.transform) return issues;

    this.cmd.transform
      .toString()
      .split(',')
      .forEach(t => {
        const file = path.resolve(__dirname, t);
        if (!file.endsWith('.js')) {
          return Logger.fatal(new Error(ERRORS.TRANSFORM_TYPE));
        }

        let transform;
        try {
          transform = fs.readFileSync(file);
        } catch (e) {
          return Logger.fatal(e, `${ERRORS.TRANSFORM_PATH} (${file})`);
        }

        try {
          issues = issues.map(issue => vm.runInThisContext(transform)(issue));
        } catch (e) {
          return Logger.fatal(e, ERRORS.TRANSFORM_ERROR);
        }
      });

    return issues;
  }
};
