'use strict';

const { normalizeOutput, parseJSON } = require('../src/Util');

describe('Util tests', () => {
  describe('normalizeOutput', () => {
    test('will return an empty array when no input is given', () => {
      expect(normalizeOutput()).toEqual([]);
    });

    test('will convert string input into split array values', () => {
      expect(normalizeOutput('foo,bar')).toEqual(['foo', 'bar']);
    });

    test('will convert string input into lowercase array values', () => {
      expect(normalizeOutput('fOO,BaR')).toEqual(['foo', 'bar']);
    });

    test('will filter out empty values', () => {
      expect(normalizeOutput('foo,bar,')).toEqual(['foo', 'bar']);
    });

    test('will lowercase array string values', () => {
      expect(normalizeOutput(['fOO', 'BaR'])).toEqual(['foo', 'bar']);
    });

    test('will filter empty array values', () => {
      expect(normalizeOutput(['fOO', '', 'BaR'])).toEqual(['foo', 'bar']);
    });
  });

  describe('parseJSON', () => {
    test('will return an empty object when no input is given', () => {
      expect(parseJSON()).toEqual({});
    });

    test('will json parse any input strings', () => {
      expect(parseJSON('{}')).toEqual({});
    });

    test('will return the input data if its already a valid js object', () => {
      expect(parseJSON({ foo: 'bar' })).toEqual({ foo: 'bar' });
    });
  });
});
