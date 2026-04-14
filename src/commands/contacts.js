const { getClient } = require('../lib/api-client')
const { printJson } = require('../lib/output')
const { withErrorHandling } = require('../lib/errors')

module.exports = (program) => {
  const contacts = program.command('contacts').description('Contact management')

  contacts
    .command('list')
    .description('List contacts')
    .option('--page <n>', 'Page number', '1')
    .option('--limit <n>', 'Results per page', '50')
    .option('--open <bool>', 'Filter by open/closed status (true/false)')
    .option('--assigned-to <userId>', 'Filter by assigned user ID')
    .option('--tags <ids>', 'Filter by tag IDs (comma-separated, contacts must have ALL tags)')
    .option('--team <teamId>', 'Filter by team ID')
    .option('--stages <ids>', 'Filter by funnel stage IDs (comma-separated)')
    .option('--date-from <date>', 'Filter updated after date (YYYY-MM-DD)')
    .option('--date-to <date>', 'Filter updated before date (YYYY-MM-DD)')
    .option('--unread', 'Only contacts with unread messages')
    .option('--blacklist', 'Only blacklisted contacts')
    .option('--scheduled', 'Only contacts with pending scheduled messages')
    .action(withErrorHandling(async (opts) => {
      const params = { page: opts.page, limit: opts.limit }
      if (opts.open) params.open = opts.open
      if (opts.assignedTo) params.assigned_to = opts.assignedTo
      if (opts.tags) params.tags = opts.tags
      if (opts.team) params.team = opts.team
      if (opts.stages) params.stages = opts.stages
      if (opts.dateFrom) params.date_from = opts.dateFrom
      if (opts.dateTo) params.date_to = opts.dateTo
      if (opts.unread) params.unread = 'true'
      if (opts.blacklist) params.blacklist = 'true'
      if (opts.scheduled) params.scheduled = 'true'
      const result = await getClient().get('/contacts', { params })
      printJson(result)
    }))

  contacts
    .command('get')
    .description('Get contact details')
    .argument('<phone>', 'Phone number (e.g. +34600000000)')
    .action(withErrorHandling(async (phone) => {
      const result = await getClient().get(`/contacts/${encodeURIComponent(phone)}`)
      printJson(result)
    }))

  contacts
    .command('create')
    .description('Create a new contact')
    .requiredOption('--phone <phone>', 'Phone number (with country code)')
    .option('--name <name>', 'Contact name')
    .option('--notes <notes>', 'Contact notes')
    .action(withErrorHandling(async (opts) => {
      const result = await getClient().post('/contacts', {
        phone: opts.phone,
        name: opts.name,
        notes: opts.notes
      })
      printJson(result)
    }))

  contacts
    .command('update')
    .description('Update a contact')
    .argument('<phone>', 'Phone number')
    .option('--name <name>', 'Contact name')
    .option('--notes <notes>', 'Contact notes')
    .option('--custom-fields <json>', 'Custom fields as JSON')
    .action(withErrorHandling(async (phone, opts) => {
      const body = {}
      if (opts.name) body.name = opts.name
      if (opts.notes) body.notes = opts.notes
      if (opts.customFields) body.customFields = JSON.parse(opts.customFields)
      const result = await getClient().put(`/contacts/${encodeURIComponent(phone)}`, body)
      printJson(result)
    }))

  contacts
    .command('delete')
    .description('Delete a contact')
    .argument('<phone>', 'Phone number')
    .action(withErrorHandling(async (phone) => {
      const result = await getClient().delete(`/contacts/${encodeURIComponent(phone)}`)
      printJson(result)
    }))

  contacts
    .command('assign')
    .description('Assign contact to user')
    .argument('<phone>', 'Phone number')
    .requiredOption('--user <userId>', 'User ID')
    .action(withErrorHandling(async (phone, opts) => {
      const result = await getClient().post(`/contacts/${encodeURIComponent(phone)}/assign/${opts.user}`)
      printJson(result)
    }))

  contacts
    .command('unassign')
    .description('Unassign contact')
    .argument('<phone>', 'Phone number')
    .action(withErrorHandling(async (phone) => {
      const result = await getClient().post(`/contacts/${encodeURIComponent(phone)}/unassign`)
      printJson(result)
    }))

  contacts
    .command('close')
    .description('Close conversation')
    .argument('<phone>', 'Phone number')
    .action(withErrorHandling(async (phone) => {
      const result = await getClient().post(`/contacts/${encodeURIComponent(phone)}/close`)
      printJson(result)
    }))

  contacts
    .command('open')
    .description('Open conversation')
    .argument('<phone>', 'Phone number')
    .action(withErrorHandling(async (phone) => {
      const result = await getClient().post(`/contacts/${encodeURIComponent(phone)}/open`)
      printJson(result)
    }))

  contacts
    .command('tag-add')
    .description('Add tag to contact')
    .argument('<phone>', 'Phone number')
    .requiredOption('--tag <tagId>', 'Tag ID')
    .action(withErrorHandling(async (phone, opts) => {
      const result = await getClient().post(`/contacts/${encodeURIComponent(phone)}/tags/${opts.tag}`)
      printJson(result)
    }))

  contacts
    .command('tag-remove')
    .description('Remove tag from contact')
    .argument('<phone>', 'Phone number')
    .requiredOption('--tag <tagId>', 'Tag ID')
    .action(withErrorHandling(async (phone, opts) => {
      const result = await getClient().delete(`/contacts/${encodeURIComponent(phone)}/tags/${opts.tag}`)
      printJson(result)
    }))

  contacts
    .command('team-add')
    .description('Add team to contact')
    .argument('<phone>', 'Phone number')
    .requiredOption('--team <teamId>', 'Team ID')
    .action(withErrorHandling(async (phone, opts) => {
      const result = await getClient().post(`/contacts/${encodeURIComponent(phone)}/teams/${opts.team}`)
      printJson(result)
    }))

  contacts
    .command('team-remove')
    .description('Remove team from contact')
    .argument('<phone>', 'Phone number')
    .requiredOption('--team <teamId>', 'Team ID')
    .action(withErrorHandling(async (phone, opts) => {
      const result = await getClient().delete(`/contacts/${encodeURIComponent(phone)}/teams/${opts.team}`)
      printJson(result)
    }))

  contacts
    .command('set-stage')
    .description('Move contact to funnel stage')
    .argument('<phone>', 'Phone number')
    .requiredOption('--funnel <funnelId>', 'Funnel ID')
    .requiredOption('--stage <stageId>', 'Stage ID')
    .action(withErrorHandling(async (phone, opts) => {
      const result = await getClient().put(`/contacts/${encodeURIComponent(phone)}/stage`, {
        funnel_id: opts.funnel,
        stage_id: opts.stage
      })
      printJson(result)
    }))

  contacts
    .command('set-notes')
    .description('Update contact notes')
    .argument('<phone>', 'Phone number')
    .requiredOption('--notes <notes>', 'Notes text')
    .action(withErrorHandling(async (phone, opts) => {
      const result = await getClient().put(`/contacts/${encodeURIComponent(phone)}/notes`, { notes: opts.notes })
      printJson(result)
    }))

  contacts
    .command('bulk')
    .description('Bulk operations on contacts')
    .requiredOption('--action <action>', 'Action: close, open, assign, add_tag, add_team')
    .requiredOption('--phones <phones>', 'Comma-separated phone numbers')
    .option('--value <value>', 'Value for action (user_id, tag_id, team_id)')
    .action(withErrorHandling(async (opts) => {
      const result = await getClient().post('/contacts/bulk', {
        action: opts.action,
        contact_ids: opts.phones.split(',').map(p => p.trim()),
        value: opts.value
      })
      printJson(result)
    }))
}
