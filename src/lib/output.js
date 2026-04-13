const Table = require('cli-table3')

function getFormat (cmd) {
  const opts = cmd.optsWithGlobals ? cmd.optsWithGlobals() : (cmd.parent ? cmd.parent.opts() : {})
  return opts.output || 'json'
}

function isQuiet (cmd) {
  const opts = cmd.optsWithGlobals ? cmd.optsWithGlobals() : (cmd.parent ? cmd.parent.opts() : {})
  return opts.quiet || false
}

function printJson (data) {
  console.log(JSON.stringify(data, null, 2))
}

function printTable (data, columns) {
  if (!Array.isArray(data) || data.length === 0) {
    console.log('No data')
    return
  }

  const cols = columns || Object.keys(data[0])
  const table = new Table({ head: cols })

  for (const row of data) {
    table.push(cols.map(c => {
      const val = row[c]
      if (val === null || val === undefined) return ''
      if (typeof val === 'object') return JSON.stringify(val)
      return String(val)
    }))
  }

  console.log(table.toString())
}

function print (cmd, data, tableColumns) {
  const format = getFormat(cmd)
  if (format === 'table' && Array.isArray(data)) {
    printTable(data, tableColumns)
  } else {
    printJson(data)
  }
}

function printResult (cmd, result) {
  const format = getFormat(cmd)
  printJson(result)
}

function printError (msg) {
  console.error(JSON.stringify({ ok: false, error: msg }))
  process.exit(1)
}

module.exports = { getFormat, isQuiet, print, printResult, printError, printJson, printTable }
