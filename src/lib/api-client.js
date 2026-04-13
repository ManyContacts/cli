const axios = require('axios')
const config = require('./config')

function createClient (opts = {}) {
  const apiUrl = opts.apiUrl || config.getApiUrl()
  const token = opts.token || config.getToken()

  const client = axios.create({
    baseURL: `${apiUrl}/cli/v1`,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'manycontacts-cli/1.0.0'
    }
  })

  if (token) {
    client.defaults.headers.common['cli-token'] = token
  }

  client.interceptors.response.use(
    response => response.data,
    error => {
      if (error.response) {
        const data = error.response.data
        const msg = data.error || data.message || `HTTP ${error.response.status}`
        throw new Error(msg)
      }
      throw error
    }
  )

  return client
}

let _client = null

function getClient (opts) {
  if (!_client || opts) {
    _client = createClient(opts)
  }
  return _client
}

module.exports = { createClient, getClient }
