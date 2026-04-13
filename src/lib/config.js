const Conf = require('conf')
const path = require('path')

const config = new Conf({
  projectName: 'manycontacts',
  cwd: path.join(require('os').homedir(), '.manycontacts')
})

module.exports = {
  getToken () {
    return config.get('cli-token') || process.env.MC_CLI_TOKEN || null
  },

  setToken (token) {
    config.set('cli-token', token)
  },

  getApiUrl () {
    return process.env.MC_API_URL || 'https://api.manycontacts.com'
  },

  getAll () {
    return config.store
  },

  clear () {
    config.clear()
  }
}
