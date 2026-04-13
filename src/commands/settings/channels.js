const { getClient } = require('../../lib/api-client')
const { printJson } = require('../../lib/output')
const { withErrorHandling } = require('../../lib/errors')

module.exports = (program) => {
  const channels = program.command('channels').description('Channel management')

  channels.command('list').description('List connected channels')
    .action(withErrorHandling(async () => {
      printJson(await getClient().get('/channels'))
    }))

  channels.command('connect').description('Connect a new channel (returns a URL to open in browser)')
    .argument('<type>', 'Channel type: whatsapp-api, whatsapp-coexistence, whatsapp-qr')
    .action(withErrorHandling(async (type) => {
      printJson(await getClient().post('/channels/connect', { type }))
    }))

  channels.command('whatsapp-profile').description('Get WhatsApp business profile')
    .action(withErrorHandling(async () => {
      printJson(await getClient().get('/channels/whatsapp/profile'))
    }))

  channels.command('update-whatsapp-profile').description('Update WhatsApp business profile')
    .option('--about <text>', 'About text')
    .option('--address <text>', 'Business address')
    .option('--description <text>', 'Business description')
    .option('--email <email>', 'Business email')
    .option('--websites <urls>', 'Comma-separated website URLs')
    .action(withErrorHandling(async (opts) => {
      const body = {}
      if (opts.about) body.about = opts.about
      if (opts.address) body.address = opts.address
      if (opts.description) body.description = opts.description
      if (opts.email) body.email = opts.email
      if (opts.websites) body.websites = opts.websites.split(',')
      printJson(await getClient().put('/channels/whatsapp/profile', body))
    }))

  channels.command('delete').description('Disconnect a channel')
    .argument('<id>', 'Channel ID')
    .action(withErrorHandling(async (id) => {
      printJson(await getClient().delete(`/channels/${id}`))
    }))
}
