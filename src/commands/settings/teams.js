const { getClient } = require('../../lib/api-client')
const { printJson } = require('../../lib/output')
const { withErrorHandling } = require('../../lib/errors')

module.exports = (program) => {
  const teams = program.command('teams').description('Team management')

  teams.command('list').description('List teams')
    .action(withErrorHandling(async () => {
      printJson(await getClient().get('/teams'))
    }))

  teams.command('create').description('Create a team')
    .requiredOption('--name <name>', 'Team name')
    .action(withErrorHandling(async (opts) => {
      printJson(await getClient().post('/teams', { name: opts.name }))
    }))

  teams.command('update').description('Update a team')
    .argument('<id>', 'Team ID')
    .option('--name <name>', 'Team name')
    .action(withErrorHandling(async (id, opts) => {
      printJson(await getClient().put(`/teams/${id}`, { name: opts.name }))
    }))

  teams.command('delete').description('Delete a team')
    .argument('<id>', 'Team ID')
    .action(withErrorHandling(async (id) => {
      printJson(await getClient().delete(`/teams/${id}`))
    }))

  teams.command('add-member').description('Add user to team')
    .argument('<teamId>', 'Team ID')
    .requiredOption('--user <userId>', 'User ID')
    .action(withErrorHandling(async (teamId, opts) => {
      printJson(await getClient().post(`/teams/${teamId}/users/${opts.user}`))
    }))

  teams.command('remove-member').description('Remove user from team')
    .argument('<teamId>', 'Team ID')
    .requiredOption('--user <userId>', 'User ID')
    .action(withErrorHandling(async (teamId, opts) => {
      printJson(await getClient().delete(`/teams/${teamId}/users/${opts.user}`))
    }))
}
