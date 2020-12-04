'use strict';

/**
 * Singleton instance
 */
module.exports = {
  debugMode: false,

  /**
   * Log a debug message.
   *
   * @param {String|Array} message
   *   The debug message to log
   */
  debug(...message) {
    if (!this.debugMode) return;
    console.log(...message);
  },

  /**
   * Log an error.
   *
   * @param {Error|String} err
   *   The error itself or an error message to use.
   * @param {String} message
   *   The user friendly message
   */
  error(err, message) {
    if (typeof err === 'string') {
      err = new Error(err);
    }

    if (this.debugMode) {
      console.error(err.stack);
    } else if (message) {
      console.error(message);
    } else {
      console.error(err.message);
    }
  },

  /**
   * Log a fatal error and exit.
   *
   * @param {Error|String} err
   *   The error itself or an error message to use.
   * @param {String} message
   *   The user friendly message
   */
  fatal(err, message) {
    this.error(err, message);
    process.exit(1);
  }
};
