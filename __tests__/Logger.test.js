'use strict';

const { exit, consoleError } = require('./Harness');
const Logger = require('../src/Logger');

describe.only('Logger', () => {
  test('starts in production mode by default', () => {
    expect(Logger.debugMode).toBe(false);
  });

  describe('error', () => {
    test('supports single parameter input as a string', () => {
      Logger.error('An error!');

      expect(Logger.debugMode).toBe(false);
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith('An error!');
    });

    test('will output the stack when running in debugMode', () => {
      Logger.debugMode = true;
      const error = new Error('An error!');
      error.stack = 'foo';
      Logger.error(error);

      expect(Logger.debugMode).toBe(true);
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith('foo');
    });

    test('will not output the stack when running in production mode', () => {
      Logger.debugMode = false;
      const error = new Error('An error!');
      error.stack = 'foo';
      Logger.error(error);

      expect(Logger.debugMode).toBe(false);
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith('An error!');
    });

    test('will output a pretty message over the default, if provided', () => {
      Logger.debugMode = false;
      const error = new Error('An error!');
      error.stack = 'foo';
      Logger.error(error, 'hello world');

      expect(Logger.debugMode).toBe(false);
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith('hello world');
    });
  });

  describe('fatal', () => {
    let error;
    beforeAll(() => {
      error = jest.spyOn(Logger, 'error');
    });

    afterEach(() => {
      error.mockClear();
    });

    afterAll(() => {
      jest.unmock(Logger);
    });

    test('calls error with the input parameters', () => {
      Logger.fatal('foo', 'bar');
      expect(error).toHaveBeenCalledTimes(1);
      expect(error).toHaveBeenCalledWith('foo', 'bar');
    });

    test('calls process.exit with 1', () => {
      Logger.fatal('foo', 'bar');
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });
  });
});
