const { getClient } = require('../../lib/api-client')
const { printJson } = require('../../lib/output')
const { withErrorHandling } = require('../../lib/errors')

module.exports = (program) => {
  const tags = program.command('tags').description('Tag management')

  tags.command('list').description('List tags')
    .action(withErrorHandling(async () => {
      printJson(await getClient().get('/tags'))
    }))

  tags.command('create').description('Create a tag')
    .requiredOption('--name <name>', 'Tag name')
    .option('--color <hex>', 'Tag color hex', '#fab1a0')
    .action(withErrorHandling(async (opts) => {
      printJson(await getClient().post('/tags', { name: opts.name, color: opts.color }))
    }))

  tags.command('update').description('Update a tag')
    .argument('<id>', 'Tag ID')
    .option('--name <name>', 'Tag name')
    .option('--color <hex>', 'Tag color hex')
    .action(withErrorHandling(async (id, opts) => {
      const body = {}
      if (opts.name) body.name = opts.name
      if (opts.color) body.color = opts.color
      printJson(await getClient().put(`/tags/${id}`, body))
    }))

  tags.command('delete').description('Delete a tag')
    .argument('<id>', 'Tag ID')
    .action(withErrorHandling(async (id) => {
      printJson(await getClient().delete(`/tags/${id}`))
    }))
}
