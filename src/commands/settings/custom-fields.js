const { getClient } = require('../../lib/api-client')
const { printJson } = require('../../lib/output')
const { withErrorHandling } = require('../../lib/errors')

module.exports = (program) => {
  const cf = program.command('custom-fields').description('Custom field management')

  cf.command('list').description('List custom fields')
    .action(withErrorHandling(async () => {
      printJson(await getClient().get('/custom-fields'))
    }))

  cf.command('create').description('Create a custom field')
    .requiredOption('--name <name>', 'Field name')
    .option('--type <type>', 'Field type', 'text')
    .action(withErrorHandling(async (opts) => {
      printJson(await getClient().post('/custom-fields', { name: opts.name, type: opts.type }))
    }))

  cf.command('update').description('Update a custom field')
    .argument('<id>', 'Field ID')
    .option('--name <name>', 'Field name')
    .option('--type <type>', 'Field type')
    .action(withErrorHandling(async (id, opts) => {
      const body = {}
      if (opts.name) body.name = opts.name
      if (opts.type) body.type = opts.type
      printJson(await getClient().put(`/custom-fields/${id}`, body))
    }))

  cf.command('delete').description('Delete a custom field')
    .argument('<id>', 'Field ID')
    .action(withErrorHandling(async (id) => {
      printJson(await getClient().delete(`/custom-fields/${id}`))
    }))
}
