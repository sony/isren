'use strict';

const fs = require('fs');
const Outputs = require('../src/outputs');
const projectSearch = jest.fn();
const projectSearchAll = jest.fn();
const issueSearch = jest.fn();
const groupSearch = jest.fn();

jest.spyOn(require('gitlab'), 'Gitlab').mockImplementation(() => ({
  Projects: {
    search: projectSearch,
    all: projectSearchAll
  },
  Issues: {
    all: issueSearch
  },
  Groups: {
    search: groupSearch
  }
}));

const exit = jest.fn();
const consoleError = jest.fn();
const consoleLog = jest.fn();
const writeFile = jest.fn();

jest.spyOn(process, 'exit').mockImplementation(exit);
jest.spyOn(console, 'error').mockImplementation(consoleError);
jest.spyOn(console, 'log').mockImplementation(consoleLog);
jest.spyOn(fs, 'writeFileSync').mockImplementation(writeFile);
const consoleOutput = jest.spyOn(Outputs, 'Console');
const jsonOutput = jest.spyOn(Outputs, 'JSON');
const csvOutput = jest.spyOn(Outputs, 'CSV');
const fileOutput = jest.spyOn(Outputs, 'File');

beforeEach(() => {
  projectSearch.mockClear();
  projectSearchAll.mockClear();
  issueSearch.mockClear();
  groupSearch.mockClear();
  exit.mockClear();
  consoleError.mockClear();
  consoleLog.mockClear();
  consoleOutput.mockClear();
  jsonOutput.mockClear();
  csvOutput.mockClear();
  fileOutput.mockClear();
  writeFile.mockClear();
});

const beginsWith = input =>
  new RegExp(`^${input.toString().replace(/[()[\]\\/]/gim, '\\$&')}`);

module.exports = {
  projectSearch,
  projectSearchAll,
  issueSearch,
  groupSearch,
  exit,
  consoleError,
  consoleLog,
  consoleOutput,
  jsonOutput,
  csvOutput,
  fileOutput,
  writeFile,
  beginsWith
};
