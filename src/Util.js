'use strict';

module.exports = {
  normalizeOutput: out => {
    if (!out) {
      return [];
    }

    if (typeof out === 'string') {
      out = out.split(',');
    }

    return out.map(s => s.toString().toLowerCase()).filter(i => i !== '');
  },

  parseJSON: input => {
    if (!input) {
      return {};
    }

    if (input && typeof input === 'string') {
      return JSON.parse(input);
    }

    return input;
  }
};
