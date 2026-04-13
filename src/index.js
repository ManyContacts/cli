// ManyContacts CLI
// Entry point for programmatic usage
const { createClient } = require('./lib/api-client')
const config = require('./lib/config')

module.exports = {
  createClient,
  config
}
