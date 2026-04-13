const { getClient } = require('../lib/api-client')
const { printJson } = require('../lib/output')
const { withErrorHandling } = require('../lib/errors')

module.exports = (program) => {
  const billing = program.command('billing').description('Billing and subscriptions')

  billing
    .command('subscriptions')
    .description('List active subscriptions')
    .action(withErrorHandling(async () => {
      const result = await getClient().get('/billing/subscriptions')
      printJson(result)
    }))

  billing
    .command('checkout')
    .description('Create a checkout session')
    .action(withErrorHandling(async () => {
      const result = await getClient().post('/billing/checkout')
      printJson(result)
    }))
}
