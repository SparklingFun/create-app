// Sentry service for Cloudflare Worker, refactored from third-party repo: 'https://github.com/bustle/cf-sentry'

// Default Sentry settings.
// Use below code in sentryWrapper

// if(!sentry.__INIT_FLAG) {
//   sentry.init({
//     retires: 5,
//     host: 'sentry.io',
//     tags: {
//       app: 'your-app-your-env',
//       real_ip: cfRealIP(event.request)
//     },
//     project: {
//       id: '',
//       key: '',
//       name: 'your-app',
//       version: '1.0.0'
//     },
//     env: 'your-env',
//     release: ''
//   })
// }

function Sentry () {
  this.__INIT_FLAG = false
  this.__SENTRY_PROJECT = {}
  this.init = function (config) {
    if(!config) {
      console.error('Sentry init fail because of undefined configuration!')
      return
    }
    if(!config.project || config.project.id === '' || config.project.key === '') {
      console.error('Sentry config is incorrect, please check!')
      return
    }
    this.RETRIES = config.retries || 5
    this.SENTRY_HOST = config.host || 'sentry.io'
    this.TAGS = config.tags || {}
    this.__SENTRY_PROJECT.ID = config.project.id
    this.__SENTRY_PROJECT.KEY = config.project.key
    this.__SENTRY_PROJECT.NAME = config.project.name || 'UNNAMED_PROJECT'
    this.__SENTRY_PROJECT.VERSION = config.project.version || '1.0.0'
    this.ENV = config.env || 'production'
    this.RELEASE = config.release || ''
    this.__INIT_FLAG = true
  }
  // ========================== Sentry Send-log ========================== 
  // Get the key from the "DSN" at: https://sentry.io/settings/<org>/projects/<project>/keys/
  // The "DSN" will be in the form: https://<SENTRY_KEY>@sentry.io/<__SENTRY_PROJECT_ID>
  // eg, https://0000aaaa1111bbbb2222cccc3333dddd@sentry.io/123456
  // this.__SENTRY_PROJECT.ID = '2'
  // this.__SENTRY_PROJECT.KEY = '82541fb0391f42099dd2ee79cfc0bbf2'
  // this.SENTRY_HOST = 'sentry.io' (or your private Sentry server.)
  this.log = async function(err, request) {
    if(!this.__INIT_FLAG) {
      console.error('Sentry init fail. All errors will go through without log.') // eslint-disable-line no-console
      return
    }
    // Use init configuration.
    const body = JSON.stringify(this.toSentryEvent(err, request))
    for (let i = 0; i <= this.RETRIES; i++) {
      const res = await fetch(`https://${this.SENTRY_HOST}/api/${this.__SENTRY_PROJECT.ID}/store/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Sentry-Auth': [
            'Sentry sentry_version=7',
            `sentry_client=${this.__SENTRY_PROJECT.NAME}/${this.__SENTRY_PROJECT.VERSION}`,
            `sentry_key=${this.__SENTRY_PROJECT.KEY}`,
          ].join(', ')
        },
        body,
      })
      if (res.status === 200) {
        return
      }
      // We couldn't send to Sentry, try to log the response at least
      console.error({ httpStatus: res.status, ...(await res.json()) }) // eslint-disable-line no-console
    }
  }


  // ========================== Sentry Event ==========================
  // Useful if you have multiple apps within a project – not necessary, only used in TAGS and SERVER_NAME below
  // const APP = 'arcto-xyz-api'

  // https://docs.sentry.io/error-reporting/configuration/?platform=javascript#environment
  // this.ENV = 'production'

  // https://docs.sentry.io/enriching-error-data/context/?platform=javascript#tagging-events
  // this.TAGS = { app: APP }

  // https://docs.sentry.io/error-reporting/configuration/?platform=javascript#server-name
  // this.SERVER_NAME = `${APP}-${ENV}`

  // https://docs.sentry.io/error-reporting/configuration/?platform=javascript#release
  // A string describing the version of the release – we just use: git rev-parse --verify HEAD
  // You can use this to associate files/source-maps: https://docs.sentry.io/cli/releases/#upload-files
  // this.RELEASE = '82541fb0391f42099dd2ee79cfc0bbf2'
  this.toSentryEvent = function(err, request) {
    const errType = err.name || (err.contructor || {}).name
    const frames = parse(err)
    const extraKeys = Object.keys(err).filter(key => !['name', 'message', 'stack'].includes(key))
    return {
      event_id: uuidv4(),
      message: errType + ': ' + (err.message || '<no message>'),
      exception: {
        values: [
          {
            type: errType,
            value: err.message,
            stacktrace: frames.length ? { frames: frames.reverse() } : undefined,
          },
        ],
      },
      extra: extraKeys.length
        ? {
            [errType]: extraKeys.reduce((obj, key) => ({ ...obj, [key]: err[key] }), {}),
          }
        : undefined,
      tags: {
        ...this.TAGS,
      },
      platform: 'javascript',
      environment: this.ENV,
      server_name: `${this.__SENTRY_PROJECT.NAME}-${this.ENV}`,
      timestamp: Date.now() / 1000,
      request:
        request && request.url
          ? {
              method: request.method,
              url: request.url,
              query_string: request.query,
              headers: request.headers,
              data: request.body,
            }
          : undefined,
      release: this.RELEASE,
    }
  }
}

// Tools
function parse(err) {
  return (err.stack || '')
    .split('\n')
    .slice(1)
    .map(line => {
      if (line.match(/^\s*[-]{4,}$/)) {
        return { filename: line }
      }

      // From https://github.com/felixge/node-stack-trace/blob/1ec9ba43eece124526c273c917104b4226898932/lib/stack-trace.js#L42
      const lineMatch = line.match(/at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/)
      if (!lineMatch) {
        return
      }

      return {
        function: lineMatch[1] || undefined,
        filename: lineMatch[2] || undefined,
        lineno: +lineMatch[3] || undefined,
        colno: +lineMatch[4] || undefined,
        in_app: lineMatch[5] !== 'native' || undefined,
      }
    })
    .filter(Boolean)
}
function uuidv4() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  return [...bytes].map(b => ('0' + b.toString(16)).slice(-2)).join('') // to hex
}

module.exports = Sentry;