const { getClient } = require('../lib/api-client')
const { printJson } = require('../lib/output')
const { withErrorHandling } = require('../lib/errors')

module.exports = (program) => {
  const campaigns = program.command('campaigns').description('Campaign management')

  campaigns
    .command('list')
    .description('List campaigns')
    .action(withErrorHandling(async () => {
      const result = await getClient().get('/campaigns')
      printJson(result)
    }))

  campaigns
    .command('create')
    .description('Create a campaign')
    .requiredOption('--name <name>', 'Campaign name')
    .requiredOption('--template <id>', 'Template ID')
    .requiredOption('--phones <phones>', 'Comma-separated phone numbers')
    .requiredOption('--date <date>', 'Scheduled date (ISO 8601)')
    .option('--variables <json>', 'Template variables as JSON array')
    .option('--header-variables <json>', 'Header variables as JSON array')
    .action(withErrorHandling(async (opts) => {
      const phones = opts.phones.split(',').map(p => p.trim())
      const result = await getClient().post('/campaigns', {
        name: opts.name,
        template_id: opts.template,
        phones,
        date: opts.date,
        variables: opts.variables || '[]',
        header_variables: opts.headerVariables || '[]'
      })
      printJson(result)
    }))

  campaigns
    .command('delete')
    .description('Delete a campaign')
    .argument('<id>', 'Campaign ID')
    .action(withErrorHandling(async (id) => {
      const result = await getClient().delete(`/campaigns/${id}`)
      printJson(result)
    }))
}
