'use strict';

const ERRORS = require('../ERRORS');
const Logger = require('../Logger');
const stringify = require('csv-stringify/lib/sync');

module.exports = (issues = [], config = {}) => {
  const firstIssue = issues.slice(0, 1).shift() || {};
  if (typeof firstIssue === 'string') {
    Logger.fatal(ERRORS.CSV_TRANSFORM_ORDER);
    return;
  }

  const columns = Object.keys(firstIssue).map(key => ({
    key
  }));
  const {
    delimiter = ',',
    quoted = false,
    quoted_empty = false,
    record_delimiter = 'unix',
    header = true
  } = config.outOptions || {};

  // Check each description field for max length. See limitations:
  // https://support.office.com/en-us/article/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3
  issues = issues.map(issue => {
    Object.keys(issue).forEach(field => {
      if (issue[field] && issue[field].toString().length > 30000) {
        issue[field] = `${issue[field].slice(0, 30000)} ...`;
      }
    });

    return issue;
  });

  return stringify(issues, {
    delimiter,
    quoted,
    quoted_empty,
    record_delimiter,
    header,
    columns
  });
};
