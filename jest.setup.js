const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const realAxios = require('axios').default

const FIXTURES_DIR = path.resolve(process.cwd(), './fixtures')
const IS_RECORD = process.env.IS_RECORD
const IS_PLAYBACK = process.env.IS_PLAYBACK
const testSlash = new RegExp('/', 'g')
const testUserUrl = new RegExp('/jest-test-user(.*)/')

const makeRequestFullPath = (method, url, payload) => {
  const basename = `${method}-${url.replace(testUserUrl, '/jest-test-user/').replace(testSlash, '-')}`
  const string = `${basename}-${JSON.stringify(payload)}`
  const hash = crypto.createHash('md5').update(string).digest('hex')
  const filename = `${basename}-${hash}.json`

  return path.join(FIXTURES_DIR, filename)
}

const makeRequest = (method, url, payload, options) => {
  const fullPath = makeRequestFullPath(method, url, payload)
  const fixtureExists = fs.existsSync(fullPath)

  if (IS_PLAYBACK && !fixtureExists) throw new Error(`${fullPath} fixture is missing.`)
  if (IS_RECORD || !fixtureExists) return recordRequest(fullPath, method, url, payload, options)

  return getRecordedRequest(fullPath)
}

const recordRequest = async (fullPath, method, url, payload, options) => {
  const res = await (method === 'get' ? realAxios.get(url, options) : realAxios[method](url, payload, options))

  const data = {
    data: res.data,
    status: res.status,
  }

  fs.writeFileSync(fullPath, JSON.stringify(data), { encoding: 'utf8' })

  return data
}

const getRecordedRequest = (fullPath) => {
  const json = fs.readFileSync(fullPath, { encoding: 'utf8' })

  return JSON.parse(json)
}

const mockAxios = {
  get: (url, options) => makeRequest('get', url, options),
  post: (url, payload, options) => makeRequest('post', url, payload, options),
  put: (url, payload, options) => makeRequest('put', url, payload, options),
  delete: (url, payload, options) => makeRequest('delete', url, payload, options),
}

jest.mock('axios', () => mockAxios)
