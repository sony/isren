'use strict';

const {
  exit,
  consoleError,
  consoleLog,
  consoleOutput,
  jsonOutput,
  csvOutput,
  fileOutput,
  writeFile,
  beginsWith
} = require('./Harness');
const Logger = require('../src/Logger');
const ERRORS = require('../src/ERRORS');
const Output = require('../src/Output');

describe('Output', () => {
  test('defaults to the json,console output when no settings are provided', async () => {
    const o = await Output(['foo', 'bar']);
    expect(consoleOutput).toHaveBeenCalledTimes(1);
    expect(consoleOutput).toHaveBeenCalledWith(
      JSON.stringify(['foo', 'bar']),
      {}
    );
    expect(consoleLog).toHaveBeenCalledTimes(1);
    expect(consoleLog).toHaveBeenCalledWith(`["foo","bar"]`);
    expect(o).toEqual(`["foo","bar"]`);
    expect(consoleError).toHaveBeenCalledTimes(0);
    expect(exit).toHaveBeenCalledTimes(0);
  });

  test('throws an error when an undefined output type is selected', async () => {
    await Output(['foo', 'bar'], { out: 'scream' });
    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringMatching(beginsWith(ERRORS.UNKNOWN_OUTPUT))
    );
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
  });

  describe('Console', () => {
    test('should call the Console output transform', async () => {
      await Output(['foo', 'bar'], { out: 'console' });
      expect(consoleOutput).toHaveBeenCalledTimes(1);
      expect(consoleOutput).toHaveBeenCalledWith(['foo', 'bar'], {
        out: 'console'
      });
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('output will coerce input data into an array', async () => {
      const o = await Output('foo', { out: 'console' });
      expect(o).toBe('foo');
      expect(consoleOutput).toHaveBeenCalledTimes(1);
      expect(consoleOutput).toHaveBeenCalledWith('foo', { out: 'console' });
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('output selection type is case insensitive', async () => {
      await Output(['foo', 'bar'], { out: 'cOnSoLe' });
      expect(consoleLog).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledWith(['foo', 'bar']);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('outputs data to the console', async () => {
      await Output(['foo', 'bar'], { out: 'console' });
      expect(consoleLog).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledWith(['foo', 'bar']);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('returns the output data for chaining', async () => {
      const o = await Output(['foo', 'bar'], { out: 'console' });
      expect(o).toEqual(['foo', 'bar']);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });
  });

  describe('JSON', () => {
    test('should call the JSON output transform', async () => {
      const o = await Output([{ foo: 'bar' }], { out: 'json' });
      expect(o).toEqual(JSON.stringify([{ foo: 'bar' }]));
      expect(jsonOutput).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('output selection type is case insensitive', async () => {
      await Output([{ foo: 'bar' }], { out: 'jSoN' });
      expect(jsonOutput).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('does not output data to the console', async () => {
      await Output([{ foo: 'bar' }], { out: 'json' });
      expect(jsonOutput).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledTimes(0);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('returns the output data for chaining', async () => {
      const o = await Output([{ foo: 'bar' }, { bar: 'baz' }], { out: 'json' });
      expect(o).toEqual(JSON.stringify([{ foo: 'bar' }, { bar: 'baz' }]));
      expect(jsonOutput).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });
  });

  describe('CSV', () => {
    test('should call the CSV output transform', async () => {
      const o = await Output([{ foo: 'bar' }], { out: 'csv' });
      expect(o).toEqual(`foo\nbar\n`);
      expect(csvOutput).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('throws an error when the issue input is in string format', async () => {
      await Output(['foo', 'bar'], { out: 'csv' });
      expect(csvOutput).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(ERRORS.CSV_TRANSFORM_ORDER);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    test('output selection type is case insensitive', async () => {
      await Output([{ foo: 'bar' }], { out: 'cSv' });
      expect(csvOutput).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('does not output data to the console', async () => {
      await Output([{ foo: 'bar' }], { out: 'csv' });
      expect(csvOutput).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledTimes(0);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('returns the output data for chaining', async () => {
      const o = await Output(
        [
          { foo1: 'bar1', foo2: 'bar2' },
          { foo1: 'baz1', foo2: 'baz2' }
        ],
        { out: 'csv' }
      );
      expect(o).toEqual(`foo1,foo2\nbar1,bar2\nbaz1,baz2\n`);
      expect(csvOutput).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('supports outOptions', async () => {
      const o = await Output(
        [
          { foo1: 'bar1', foo2: 'bar2' },
          { foo1: 'baz1', foo2: 'baz2' }
        ],
        { out: 'csv', outOptions: { delimiter: ';' } }
      );
      expect(o).toEqual(`foo1;foo2\nbar1;bar2\nbaz1;baz2\n`);
      expect(csvOutput).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('any issue field longer than 30k chars will be truncated', async () => {
      const o = await Output([{ description: 'a'.repeat(40000) }], {
        out: 'csv'
      });
      expect(o).toEqual(`description\n${'a'.repeat(30000)} ...\n`);
      expect(csvOutput).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });
  });

  describe('File', () => {
    test('should call the File output transform', async () => {
      await Output([{ foo: 'bar' }], { out: 'file', file: 'foo.bar' });
      expect(fileOutput).toHaveBeenCalledTimes(1);
      expect(writeFile).toHaveBeenCalledTimes(1);
      expect(writeFile).toHaveBeenCalledWith('foo.bar', [{ foo: 'bar' }]);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('will throw an error if fs.writeFileSync has an error', async () => {
      // Override fs.writeFileSync mock we have.
      Logger.debugMode = false;
      const fs = require('fs');
      const thrower = jest.fn(() => {
        throw new Error('FOO');
      });
      jest.spyOn(fs, 'writeFileSync').mockImplementation(thrower);

      await Output([{ foo: 'bar' }], { out: 'file', file: 'foo.bar' });
      expect(fileOutput).toHaveBeenCalledTimes(1);
      expect(writeFile).toHaveBeenCalledTimes(0);
      expect(thrower).toHaveBeenCalledTimes(1);
      expect(thrower).toHaveBeenCalledWith('foo.bar', [{ foo: 'bar' }]);
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringMatching(beginsWith(ERRORS.FILE_WRITE_ERROR))
      );
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);

      // Replace the old fs.writeFileSync mock
      jest.spyOn(fs, 'writeFileSync').mockImplementation(writeFile);
    });

    test('output selection type is case insensitive', async () => {
      await Output([{ foo: 'bar' }], { out: 'fIlE', file: 'foo.bar' });
      expect(fileOutput).toHaveBeenCalledTimes(1);
      expect(writeFile).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('does not output data to the console', async () => {
      await Output([{ foo: 'bar' }], { out: 'file', file: 'foo.bar' });
      expect(fileOutput).toHaveBeenCalledTimes(1);
      expect(writeFile).toHaveBeenCalledTimes(1);
      expect(consoleLog).toHaveBeenCalledTimes(0);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });

    test('returns the output data for chaining', async () => {
      const o = await Output([{ foo: 'bar' }, { bar: 'baz' }], {
        out: 'file',
        file: 'foo.bar'
      });
      expect(o).toEqual([{ foo: 'bar' }, { bar: 'baz' }]);
      expect(fileOutput).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledTimes(0);
      expect(exit).toHaveBeenCalledTimes(0);
    });
  });
});
