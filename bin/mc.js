#!/usr/bin/env node

const { program } = require('commander')
const pkg = require('../package.json')

program
  .name('mc')
  .description('ManyContacts CLI - Programmatic access to all ManyContacts operations')
  .version(pkg.version)
  .option('--output <format>', 'Output format: json, table, plain', 'json')
  .option('--quiet', 'Suppress spinners and colors')
  .option('--api-url <url>', 'API base URL', process.env.MC_API_URL || 'https://api.manycontacts.com')

require('../src/commands/auth')(program)
require('../src/commands/contacts')(program)
require('../src/commands/messages')(program)
require('../src/commands/organization')(program)
require('../src/commands/users')(program)
require('../src/commands/campaigns')(program)
require('../src/commands/templates')(program)
require('../src/commands/settings/tags')(program)
require('../src/commands/settings/teams')(program)
require('../src/commands/settings/funnels')(program)
require('../src/commands/settings/custom-fields')(program)
require('../src/commands/settings/short-responses')(program)
require('../src/commands/settings/ai-agents')(program)
require('../src/commands/settings/channels')(program)
require('../src/commands/settings/widget')(program)
require('../src/commands/billing')(program)
require('../src/commands/email')(program)
require('../src/commands/context')(program)

program.parse(process.argv)
