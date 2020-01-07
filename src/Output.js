'use strict';

const ERRORS = require('./ERRORS');
const Logger = require('./Logger');
const Output = require('./outputs');
const { normalizeOutput } = require('./Util');

module.exports = async (issues, config = {}) => {
  let { out = [] } = config;
  out = normalizeOutput(out);

  if (!out || !out.length) {
    out = normalizeOutput(['json', 'console']);
  }

  let p = Promise.resolve(issues);
  out.forEach(format => {
    switch (format) {
      case 'console':
        p = p.then(issues => Output.Console(issues, config));
        break;
      case 'json':
        p = p.then(issues => Output.JSON(issues, config));
        break;
      case 'csv':
        p = p.then(issues => Output.CSV(issues, config));
        break;
      case 'file':
        p = p.then(issues => Output.File(issues, config));
        break;
      default:
        return Logger.fatal(`${ERRORS.UNKNOWN_OUTPUT} ${format}`);
    }
  });

  return p;
};
