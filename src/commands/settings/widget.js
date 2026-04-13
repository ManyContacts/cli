const { getClient } = require('../../lib/api-client')
const { printJson } = require('../../lib/output')
const { withErrorHandling } = require('../../lib/errors')

module.exports = (program) => {
  const widget = program.command('widget').description('Widget configuration')

  widget.command('get').description('Get widget configuration')
    .action(withErrorHandling(async () => {
      printJson(await getClient().get('/widget'))
    }))

  widget.command('update').description('Update widget configuration')
    .option('--name <name>', 'Widget display name')
    .action(withErrorHandling(async (opts) => {
      const body = {}
      if (opts.name) body.name = opts.name
      printJson(await getClient().put('/widget', body))
    }))

  widget.command('get-code').description('Get widget embed code snippet')
    .action(withErrorHandling(async () => {
      printJson(await getClient().get('/widget/code'))
    }))
}
