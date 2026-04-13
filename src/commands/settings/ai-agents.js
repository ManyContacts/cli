const { getClient } = require('../../lib/api-client')
const { printJson } = require('../../lib/output')
const { withErrorHandling } = require('../../lib/errors')

module.exports = (program) => {
  const ai = program.command('ai-agents').description('AI agent management')

  ai.command('list').description('List AI agents')
    .action(withErrorHandling(async () => {
      printJson(await getClient().get('/ai/agents'))
    }))

  ai.command('get').description('Get AI agent details')
    .argument('<id>', 'Agent user ID')
    .action(withErrorHandling(async (id) => {
      printJson(await getClient().get(`/ai/agents/${id}`))
    }))

  ai.command('create').description('Create an AI agent')
    .requiredOption('--name <name>', 'Agent name')
    .option('--instructions <text>', 'Agent instructions')
    .option('--active <bool>', 'Active', 'true')
    .action(withErrorHandling(async (opts) => {
      printJson(await getClient().post('/ai/agents', {
        name: opts.name,
        block_1: opts.instructions,
        active: opts.active === 'true'
      }))
    }))

  ai.command('update').description('Update an AI agent')
    .argument('<id>', 'Agent user ID')
    .option('--name <name>', 'Agent name')
    .option('--instructions <text>', 'Agent instructions')
    .option('--active <bool>', 'Active')
    .option('--scenarios <json>', 'Scenarios as JSON array')
    .action(withErrorHandling(async (id, opts) => {
      const body = {}
      if (opts.name) body.name = opts.name
      if (opts.instructions) body.block_1 = opts.instructions
      if (opts.active !== undefined) body.active = opts.active === 'true'
      if (opts.scenarios) body.scenarios = JSON.parse(opts.scenarios)
      printJson(await getClient().put(`/ai/agents/${id}`, body))
    }))

  ai.command('delete').description('Delete an AI agent')
    .argument('<id>', 'Agent user ID')
    .action(withErrorHandling(async (id) => {
      printJson(await getClient().delete(`/ai/agents/${id}`))
    }))

  ai.command('feedback').description('Get AI agent feedback')
    .argument('<id>', 'Agent user ID')
    .action(withErrorHandling(async (id) => {
      printJson(await getClient().get(`/ai/agents/${id}/feedback`))
    }))

}
