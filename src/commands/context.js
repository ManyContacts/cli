const { getClient } = require('../lib/api-client')
const { printJson } = require('../lib/output')
const { withErrorHandling } = require('../lib/errors')

module.exports = (program) => {
  program
    .command('context')
    .description('Get a summary of the account state (organization, channels, counts, features)')
    .action(withErrorHandling(async () => {
      const result = await getClient().get('/context')
      printJson(result)
    }))
}
