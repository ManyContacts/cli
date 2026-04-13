const { getClient } = require('../../lib/api-client')
const { printJson } = require('../../lib/output')
const { withErrorHandling } = require('../../lib/errors')

module.exports = (program) => {
  const funnels = program.command('funnels').description('Funnel/pipeline management')

  funnels.command('list').description('List funnels with stages')
    .action(withErrorHandling(async () => {
      printJson(await getClient().get('/funnels'))
    }))

  funnels.command('create').description('Create a funnel')
    .requiredOption('--name <name>', 'Funnel name')
    .action(withErrorHandling(async (opts) => {
      printJson(await getClient().post('/funnels', { name: opts.name }))
    }))

  funnels.command('update').description('Update a funnel')
    .argument('<id>', 'Funnel ID')
    .option('--name <name>', 'Funnel name')
    .action(withErrorHandling(async (id, opts) => {
      printJson(await getClient().put(`/funnels/${id}`, { name: opts.name }))
    }))

  funnels.command('delete').description('Delete a funnel')
    .argument('<id>', 'Funnel ID')
    .action(withErrorHandling(async (id) => {
      printJson(await getClient().delete(`/funnels/${id}`))
    }))

  funnels.command('add-stage').description('Add a stage to funnel')
    .argument('<funnelId>', 'Funnel ID')
    .requiredOption('--name <name>', 'Stage name')
    .option('--order <n>', 'Stage order', '0')
    .option('--color <hex>', 'Stage color')
    .action(withErrorHandling(async (funnelId, opts) => {
      printJson(await getClient().post(`/funnels/${funnelId}/stages`, {
        name: opts.name,
        order: parseInt(opts.order),
        color: opts.color
      }))
    }))

  funnels.command('update-stage').description('Update a funnel stage')
    .argument('<funnelId>', 'Funnel ID')
    .argument('<stageId>', 'Stage ID')
    .option('--name <name>', 'Stage name')
    .option('--order <n>', 'Stage order')
    .option('--color <hex>', 'Stage color')
    .action(withErrorHandling(async (funnelId, stageId, opts) => {
      const body = {}
      if (opts.name) body.name = opts.name
      if (opts.order) body.order = parseInt(opts.order)
      if (opts.color) body.color = opts.color
      printJson(await getClient().put(`/funnels/${funnelId}/stages/${stageId}`, body))
    }))

  funnels.command('delete-stage').description('Delete a funnel stage')
    .argument('<funnelId>', 'Funnel ID')
    .argument('<stageId>', 'Stage ID')
    .option('--move-to <stageId>', 'Move contacts to this stage before deleting')
    .action(withErrorHandling(async (funnelId, stageId, opts) => {
      const params = opts.moveTo ? { move_to: opts.moveTo } : {}
      printJson(await getClient().delete(`/funnels/${funnelId}/stages/${stageId}`, { params }))
    }))

  funnels.command('contacts').description('List contacts in a funnel')
    .argument('<funnelId>', 'Funnel ID')
    .option('--stage <stageId>', 'Stage ID filter')
    .option('--page <n>', 'Page number', '1')
    .option('--limit <n>', 'Results per page', '50')
    .action(withErrorHandling(async (funnelId, opts) => {
      const params = { page: opts.page, limit: opts.limit }
      const url = opts.stage ? `/funnels/${funnelId}/contacts?stageId=${opts.stage}` : `/funnels/${funnelId}/contacts`
      printJson(await getClient().get(url, { params }))
    }))
}
