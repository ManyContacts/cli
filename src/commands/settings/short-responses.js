const { getClient } = require('../../lib/api-client')
const { printJson } = require('../../lib/output')
const { withErrorHandling } = require('../../lib/errors')

module.exports = (program) => {
  const sr = program.command('short-responses').description('Quick reply management')

  sr.command('list').description('List short responses')
    .action(withErrorHandling(async () => {
      printJson(await getClient().get('/short-responses'))
    }))

  sr.command('create').description('Create a short response')
    .requiredOption('--name <name>', 'Response name/shortcut')
    .requiredOption('--text <text>', 'Response text')
    .action(withErrorHandling(async (opts) => {
      printJson(await getClient().post('/short-responses', { name: opts.name, text: opts.text }))
    }))

  sr.command('update').description('Update a short response')
    .argument('<id>', 'Response ID')
    .option('--name <name>', 'Response name')
    .option('--text <text>', 'Response text')
    .action(withErrorHandling(async (id, opts) => {
      const body = {}
      if (opts.name) body.name = opts.name
      if (opts.text) body.text = opts.text
      printJson(await getClient().put(`/short-responses/${id}`, body))
    }))

  sr.command('delete').description('Delete a short response')
    .argument('<id>', 'Response ID')
    .action(withErrorHandling(async (id) => {
      printJson(await getClient().delete(`/short-responses/${id}`))
    }))
}
