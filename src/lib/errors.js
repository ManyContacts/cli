const { printError } = require('./output')

function handleError (err) {
  const msg = err.message || String(err)
  printError(msg)
}

function withErrorHandling (fn) {
  return async (...args) => {
    try {
      await fn(...args)
    } catch (err) {
      handleError(err)
    }
  }
}

module.exports = { handleError, withErrorHandling }
