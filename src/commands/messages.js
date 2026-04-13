const fs = require('fs')
const path = require('path')
const FormData = require('form-data')
const { getClient } = require('../lib/api-client')
const { printJson } = require('../lib/output')
const { withErrorHandling } = require('../lib/errors')

module.exports = (program) => {
  const messages = program.command('messages').description('Message and conversation management')

  messages
    .command('list')
    .description('List messages for a contact')
    .argument('<phone>', 'Phone number (e.g. +34600000000)')
    .option('--page <n>', 'Page number', '1')
    .option('--limit <n>', 'Results per page', '50')
    .action(withErrorHandling(async (phone, opts) => {
      const result = await getClient().get(`/contacts/${encodeURIComponent(phone)}/messages`, {
        params: { page: opts.page, limit: opts.limit }
      })
      printJson(result)
    }))

  messages
    .command('get')
    .description('Get a specific message')
    .argument('<phone>', 'Phone number')
    .argument('<messageId>', 'Message ID')
    .action(withErrorHandling(async (phone, messageId) => {
      const result = await getClient().get(`/contacts/${encodeURIComponent(phone)}/messages/${messageId}`)
      printJson(result)
    }))

  const send = messages.command('send').description('Send a message')

  send
    .command('text')
    .description('Send a text message')
    .argument('<phone>', 'Phone number')
    .requiredOption('--body <text>', 'Message text')
    .action(withErrorHandling(async (phone, opts) => {
      const result = await getClient().post(`/contacts/${encodeURIComponent(phone)}/messages/text`, {
        body: opts.body
      })
      printJson(result)
    }))

  send
    .command('note')
    .description('Send an internal note')
    .argument('<phone>', 'Phone number')
    .requiredOption('--body <text>', 'Note text')
    .action(withErrorHandling(async (phone, opts) => {
      const result = await getClient().post(`/contacts/${encodeURIComponent(phone)}/messages/note`, {
        body: opts.body
      })
      printJson(result)
    }))

  send
    .command('media')
    .description('Send a media file')
    .argument('<phone>', 'Phone number')
    .requiredOption('--file <path>', 'File path')
    .option('--caption <text>', 'File caption')
    .action(withErrorHandling(async (phone, opts) => {
      const filePath = path.resolve(opts.file)
      const form = new FormData()
      form.append('file', fs.createReadStream(filePath))
      if (opts.caption) form.append('caption', opts.caption)

      const client = getClient()
      const result = await client.post(`/contacts/${encodeURIComponent(phone)}/messages/media`, form, {
        headers: { ...form.getHeaders(), 'cli-token': client.defaults.headers.common['cli-token'] }
      })
      printJson(result)
    }))

  send
    .command('template')
    .description('Send a template message')
    .argument('<phone>', 'Phone number')
    .requiredOption('--template <id>', 'Template ID')
    .option('--vars <json>', 'Template variables as JSON array', '[]')
    .option('--header-vars <json>', 'Header variables as JSON array', '[]')
    .action(withErrorHandling(async (phone, opts) => {
      const result = await getClient().post(`/contacts/${encodeURIComponent(phone)}/messages/template`, {
        template_id: opts.template,
        variables: JSON.parse(opts.vars),
        header_variables: JSON.parse(opts.headerVars)
      })
      printJson(result)
    }))

  messages
    .command('read')
    .description('Mark messages as read')
    .argument('<phone>', 'Phone number')
    .argument('<messageId>', 'Message ID')
    .action(withErrorHandling(async (phone, messageId) => {
      const result = await getClient().post(`/contacts/${encodeURIComponent(phone)}/messages/${messageId}/read`)
      printJson(result)
    }))
}
