const { getClient } = require('../lib/api-client')
const { printJson } = require('../lib/output')
const { withErrorHandling } = require('../lib/errors')

module.exports = (program) => {
  const users = program.command('users').description('User management')

  users
    .command('list')
    .description('List organization users')
    .action(withErrorHandling(async () => {
      const result = await getClient().get('/users')
      printJson(result)
    }))

  users
    .command('get')
    .description('Get user details')
    .argument('<id>', 'User ID')
    .action(withErrorHandling(async (id) => {
      const result = await getClient().get(`/users/${id}`)
      printJson(result)
    }))

  users
    .command('update')
    .description('Update user')
    .argument('<id>', 'User ID')
    .option('--name <name>', 'User name')
    .option('--auto-routing <bool>', 'Enable auto-routing')
    .option('--permissions <json>', 'Permissions JSON')
    .action(withErrorHandling(async (id, opts) => {
      const body = {}
      if (opts.name) body.name = opts.name
      if (opts.autoRouting !== undefined) body.autoRouting = opts.autoRouting === 'true'
      if (opts.permissions) body.permissions = JSON.parse(opts.permissions)
      const result = await getClient().put(`/users/${id}`, body)
      printJson(result)
    }))

  users
    .command('delete')
    .description('Delete user')
    .argument('<id>', 'User ID')
    .action(withErrorHandling(async (id) => {
      const result = await getClient().delete(`/users/${id}`)
      printJson(result)
    }))

  users
    .command('invite')
    .description('Invite a new user')
    .requiredOption('--email <email>', 'User email')
    .option('--permissions <json>', 'Permissions JSON')
    .action(withErrorHandling(async (opts) => {
      const result = await getClient().post('/invitations', {
        email: opts.email,
        permissions: opts.permissions ? JSON.parse(opts.permissions) : undefined
      })
      printJson(result)
    }))

  users
    .command('invitations')
    .description('List pending invitations')
    .action(withErrorHandling(async () => {
      const result = await getClient().get('/invitations')
      printJson(result)
    }))

  users
    .command('revoke-invitation')
    .description('Revoke an invitation')
    .argument('<id>', 'Invitation ID')
    .action(withErrorHandling(async (id) => {
      const result = await getClient().delete(`/invitations/${id}`)
      printJson(result)
    }))

  users
    .command('permissions-schema')
    .description('Get available permissions schema')
    .action(withErrorHandling(async () => {
      const result = await getClient().get('/permissions/schema')
      printJson(result)
    }))
}
