const { createClient } = require('../lib/api-client')
const config = require('../lib/config')
const { printJson } = require('../lib/output')
const { withErrorHandling } = require('../lib/errors')

module.exports = (program) => {
  const auth = program.command('auth').description('Authentication and token management')

  auth
    .command('login')
    .description('Login with email and password, then create a CLI token')
    .requiredOption('--email <email>', 'Account email')
    .requiredOption('--password <password>', 'Account password')
    .option('--token-name <name>', 'CLI token name', 'CLI Token')
    .option('--scopes <scopes>', 'Comma-separated scopes', '*')
    .action(withErrorHandling(async (opts) => {
      const apiUrl = program.opts().apiUrl || config.getApiUrl()
      const client = createClient({ apiUrl })

      const loginResult = await client.post('/auth/login', {
        email: opts.email,
        password: opts.password
      })

      const tokenClient = createClient({ apiUrl })
      tokenClient.defaults.headers.common.token = loginResult.data.accessToken

      const scopes = opts.scopes.split(',').map(s => s.trim())
      const tokenResult = await tokenClient.post('/auth/token', {
        name: opts.tokenName,
        scopes
      })

      config.setToken(tokenResult.data.token)

      printJson({
        ok: true,
        data: {
          message: 'Login successful. CLI token stored.',
          token_id: tokenResult.data.id,
          token_name: tokenResult.data.name,
          scopes: tokenResult.data.scopes
        }
      })
    }))

  auth
    .command('register')
    .description('Register a new ManyContacts account')
    .requiredOption('--email <email>', 'Account email')
    .option('--password <password>', 'Account password')
    .option('--name <name>', 'Organization name')
    .option('--locale <locale>', 'Locale (es, en)', 'es')
    .action(withErrorHandling(async (opts) => {
      const apiUrl = program.opts().apiUrl || config.getApiUrl()
      const client = createClient({ apiUrl })

      const result = await client.post('/auth/register', {
        email: opts.email,
        password: opts.password,
        name: opts.name,
        locale: opts.locale
      })

      printJson(result)
    }))

  auth
    .command('whoami')
    .description('Show current authenticated user and organization')
    .action(withErrorHandling(async () => {
      const { getClient } = require('../lib/api-client')
      const result = await getClient().get('/auth/whoami')
      printJson(result)
    }))

  auth
    .command('token-create')
    .description('Create a new CLI token (requires existing auth)')
    .requiredOption('--name <name>', 'Token name')
    .option('--scopes <scopes>', 'Comma-separated scopes', '*')
    .option('--expires <date>', 'Expiration date (ISO 8601)')
    .action(withErrorHandling(async (opts) => {
      const { getClient } = require('../lib/api-client')
      const scopes = opts.scopes.split(',').map(s => s.trim())
      const result = await getClient().post('/auth/token', {
        name: opts.name,
        scopes,
        expires_at: opts.expires
      })
      printJson(result)
    }))

  auth
    .command('token-list')
    .description('List CLI tokens')
    .action(withErrorHandling(async () => {
      const { getClient } = require('../lib/api-client')
      const result = await getClient().get('/auth/tokens')
      printJson(result)
    }))

  auth
    .command('token-revoke')
    .description('Revoke a CLI token')
    .argument('<id>', 'Token ID')
    .action(withErrorHandling(async (id) => {
      const { getClient } = require('../lib/api-client')
      const result = await getClient().delete(`/auth/tokens/${id}`)
      printJson(result)
    }))

  auth
    .command('token-rotate')
    .description('Rotate a CLI token (create new, revoke old)')
    .argument('<id>', 'Token ID')
    .action(withErrorHandling(async (id) => {
      const { getClient } = require('../lib/api-client')
      const result = await getClient().post(`/auth/tokens/${id}/rotate`)
      if (result.data && result.data.token) {
        config.setToken(result.data.token)
      }
      printJson(result)
    }))

  auth
    .command('logout')
    .description('Remove stored credentials')
    .action(() => {
      config.clear()
      printJson({ ok: true, data: { message: 'Logged out' } })
    })

}
