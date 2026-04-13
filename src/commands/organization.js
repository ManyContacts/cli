const { getClient } = require('../lib/api-client')
const { printJson } = require('../lib/output')
const { withErrorHandling } = require('../lib/errors')

module.exports = (program) => {
  const org = program.command('org').description('Organization management')

  org
    .command('get')
    .description('Get organization details')
    .action(withErrorHandling(async () => {
      const result = await getClient().get('/organization')
      printJson(result)
    }))

  org
    .command('update')
    .description('Update organization settings')
    .option('--name <name>', 'Organization name')
    .option('--timezone <tz>', 'Timezone')
    .option('--auto-reply-open <bool>', 'Enable open auto-reply')
    .option('--auto-reply-open-text <text>', 'Open auto-reply text')
    .option('--auto-reply-close <bool>', 'Enable close auto-reply')
    .option('--auto-reply-away <bool>', 'Enable away auto-reply')
    .option('--auto-routing-random <bool>', 'Enable random routing')
    .action(withErrorHandling(async (opts) => {
      const body = {}
      if (opts.name) body.name = opts.name
      if (opts.timezone) body.timezone = opts.timezone
      if (opts.autoReplyOpen !== undefined) body.autoReplyOpen = opts.autoReplyOpen === 'true'
      if (opts.autoReplyOpenText) body.autoReplyOpenText = opts.autoReplyOpenText
      if (opts.autoReplyClose !== undefined) body.autoReplyClose = opts.autoReplyClose === 'true'
      if (opts.autoReplyAway !== undefined) body.autoReplyAway = opts.autoReplyAway === 'true'
      if (opts.autoRoutingRandom !== undefined) body.autoRoutingRandom = opts.autoRoutingRandom === 'true'
      const result = await getClient().put('/organization', body)
      printJson(result)
    }))

  const schedule = org.command('schedule').description('Organization schedule')

  schedule
    .command('get')
    .description('Get organization schedule')
    .action(withErrorHandling(async () => {
      const result = await getClient().get('/organization/schedule')
      printJson(result)
    }))

  schedule
    .command('update')
    .description('Update schedule (pass JSON)')
    .requiredOption('--data <json>', 'Schedule array as JSON')
    .action(withErrorHandling(async (opts) => {
      const result = await getClient().put('/organization/schedule', {
        schedule: JSON.parse(opts.data)
      })
      printJson(result)
    }))

  org
    .command('apikey')
    .description('Get organization API key')
    .action(withErrorHandling(async () => {
      const result = await getClient().get('/organization/apikey')
      printJson(result)
    }))

  org
    .command('checklist')
    .description('Get success checklist')
    .action(withErrorHandling(async () => {
      const result = await getClient().get('/organization/checklist')
      printJson(result)
    }))

  org
    .command('empty')
    .description('Empty account (destructive!)')
    .option('--confirm', 'Confirm the destructive operation')
    .action(withErrorHandling(async (opts) => {
      if (!opts.confirm) {
        printJson({ ok: false, error: 'Use --confirm to confirm this destructive operation' })
        return
      }
      const result = await getClient().post('/organization/empty', { confirm: true })
      printJson(result)
    }))
}
