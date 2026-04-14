const { getClient } = require('../lib/api-client')
const { printJson } = require('../lib/output')
const { withErrorHandling } = require('../lib/errors')

module.exports = (program) => {
  const templates = program.command('templates').description('WhatsApp message template management')

  templates.command('list').description('List templates')
    .option('--status <status>', 'Filter by status: approved, pending, rejected')
    .action(withErrorHandling(async (opts) => {
      const params = {}
      if (opts.status) params.status = opts.status
      printJson(await getClient().get('/templates', { params }))
    }))

  templates.command('get').description('Get template details')
    .argument('<id>', 'Template ID')
    .action(withErrorHandling(async (id) => {
      printJson(await getClient().get(`/templates/${id}`))
    }))

  templates.command('sync').description('Sync templates from WhatsApp (Meta Cloud API)')
    .action(withErrorHandling(async () => {
      printJson(await getClient().post('/templates/sync'))
    }))
}
