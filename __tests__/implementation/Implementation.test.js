'use strict';

const { exit, consoleError, beginsWith } = require('../Harness');
const ERRORS = require('../../src/ERRORS');
const Implementation = require('../../src/implementation/');

describe('Base implementation', () => {
  describe('Core', () => {
    test('will exit and print errors if no settings exists', async () => {
      // eslint-disable-next-line no-new
      new Implementation();

      expect(consoleError).toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(ERRORS.EMPTY_URL);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will exit and print an error if no url exists', async () => {
      // eslint-disable-next-line no-new
      new Implementation('', undefined, { auth: 'foo' });

      expect(consoleError).toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(ERRORS.EMPTY_URL);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will exit and print an error if no auth token exists', async () => {
      // eslint-disable-next-line no-new
      new Implementation('', `https://foo.bar.com:1234/team/foo`);

      expect(consoleError).toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(ERRORS.MISSING_AUTH);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will print no errors if both the url and auth token are supplied', async () => {
      // eslint-disable-next-line no-new
      new Implementation('', 'https://foo.bar.com:1234/team/foo', {
        auth: 'token_secret'
      });

      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('will exit and print an error if the file name is defined but file output is not', async () => {
      // eslint-disable-next-line no-new
      new Implementation('', 'https://foo.bar.com:1234/team/foo', {
        auth: 'token_secret',
        file: 'test.csv'
      });
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(ERRORS.MISSING_FILE_OUT);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will exit and print an error if the file output is defined but file name is not', async () => {
      // eslint-disable-next-line no-new
      new Implementation('', 'https://foo.bar.com:1234/team/foo', {
        auth: 'token_secret',
        out: 'file'
      });
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(ERRORS.FILE_TRANSFORM_NAME);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will not exit or print an error if the file output and file name is defined', async () => {
      // eslint-disable-next-line no-new
      new Implementation('', 'https://foo.bar.com:1234/team/foo', {
        auth: 'token_secret',
        out: 'file',
        file: 'test.csv'
      });
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });
  });

  describe('isImplementation', () => {
    test('exits with error for the base class', () => {
      Implementation.isImplementation();

      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(ERRORS.NYI_IS_IMPLEMENTATION);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });
  });

  describe('getIssues', () => {
    test('exits with error for the base class', () => {
      const i = new Implementation('', 'https://foo.bar.com:1234/team/foo', {
        auth: 'token_secret'
      });
      i.getIssues();

      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringMatching(beginsWith(ERRORS.NYI_GET_ISSUES))
      );
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });
  });

  describe('authenticate', () => {
    test('exits with error for the base class', () => {
      const i = new Implementation('', 'https://foo.bar.com:1234/team/foo', {
        auth: 'token_secret'
      });
      i.authenticate();

      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringMatching(beginsWith(ERRORS.NYI_AUTHENTICATE))
      );
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });
  });

  describe('transform', () => {
    test('will return the input issues if no transform is defined', () => {
      const i = new Implementation('', 'https://foo.bar.com:1234/team/foo', {
        auth: 'token_secret'
      });

      expect(i.transform([])).toEqual([]);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('will throw an error if the transform is not a js file', () => {
      const i = new Implementation('', 'https://foo.bar.com:1234/team/foo', {
        auth: 'token_secret',
        transform: 'foo.c'
      });
      i.transform([]);

      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(ERRORS.TRANSFORM_TYPE);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will throw an error for non-existent file paths', () => {
      const i = new Implementation('', 'https://foo.bar.com:1234/team/foo', {
        auth: 'token_secret',
        transform: 'bar.js'
      });
      i.transform([]);

      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringMatching(beginsWith(ERRORS.TRANSFORM_PATH))
      );
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('will not throw an error if an error occurs in the transform', () => {
      const i = new Implementation('', 'https://foo.bar.com:1234/team/foo', {
        auth: 'token_secret',
        transform: '../../__tests__/transforms/error.js'
      });
      i.transform([]);

      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('will run the transform if it exists', () => {
      const i = new Implementation('', 'https://foo.bar.com:1234/team/foo', {
        auth: 'token_secret',
        transform: '../../__tests__/transforms/bitflip.js'
      });
      expect(i.transform([0])).toEqual([1]);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('will run the transform for each issue', () => {
      const i = new Implementation('', 'https://foo.bar.com:1234/team/foo', {
        auth: 'token_secret',
        transform: '../../__tests__/transforms/double.js'
      });
      expect(i.transform([1, 2])).toEqual([2, 4]);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });
  });
});
