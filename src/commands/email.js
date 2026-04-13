const { getClient } = require('../lib/api-client')
const { printJson } = require('../lib/output')
const { withErrorHandling } = require('../lib/errors')

module.exports = (program) => {
  const email = program.command('email').description('Email integration')

  email
    .command('status')
    .description('Get email connection status')
    .action(withErrorHandling(async () => {
      const result = await getClient().get('/email/status')
      printJson(result)
    }))

  email
    .command('folders')
    .description('List email folders')
    .action(withErrorHandling(async () => {
      const result = await getClient().get('/email/folders')
      printJson(result)
    }))

  email
    .command('list')
    .description('List email messages')
    .option('--folder <id>', 'Folder ID')
    .option('--page <n>', 'Page number')
    .action(withErrorHandling(async (opts) => {
      const params = {}
      if (opts.folder) params.folder_id = opts.folder
      if (opts.page) params.page = opts.page
      const result = await getClient().get('/email/messages', { params })
      printJson(result)
    }))

  email
    .command('get')
    .description('Get email message details')
    .argument('<id>', 'Email message ID')
    .action(withErrorHandling(async (id) => {
      const result = await getClient().get(`/email/messages/${id}`)
      printJson(result)
    }))

  email
    .command('send')
    .description('Send an email')
    .requiredOption('--to <email>', 'Recipient email')
    .requiredOption('--subject <subject>', 'Email subject')
    .requiredOption('--body <html>', 'Email body (HTML)')
    .option('--account <id>', 'Sender account ID')
    .action(withErrorHandling(async (opts) => {
      const result = await getClient().post('/email/send', {
        to: opts.to,
        subject: opts.subject,
        body: opts.body,
        account_id: opts.account
      })
      printJson(result)
    }))

  email
    .command('disconnect')
    .description('Disconnect email integration')
    .action(withErrorHandling(async () => {
      const result = await getClient().delete('/email/disconnect')
      printJson(result)
    }))
}
