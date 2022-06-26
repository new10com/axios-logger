import { AxiosLogger, LogFn } from './axios-logger'
import { logger } from './logger/logger'
import { defaultConfig } from './config/axios-logger-config'

import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios'
import { configure, getLogger } from 'log4js'

describe(`Axios Logger Test Suite`, () => {
  configure({
    appenders: {
      axios: { type: 'console', layout: { type: 'colored' }, level: 'debug' },
    },
    categories: { default: { appenders: ['axios'], level: 'debug' } },
  })
  describe(`Axios Logger Constructor Test Suite`, () => {
    it(`should use static constructor`, () => {
      let message = ''
      const loggerMock: LogFn = (
        msg: string | object,
        ..._args: unknown[]
      ): void => {
        message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(message)
      }
      const log4jsLogger = getLogger('axios')
      log4jsLogger.info = loggerMock
      const axiosLogger = AxiosLogger.using(
        log4jsLogger.info.bind(log4jsLogger),
        log4jsLogger.error.bind(log4jsLogger)
      )
      const url = 'https://doodle.com'
      const method: Method = 'GET'
      const headers = { 'Content-Type': 'application/json' }
      const axiosRequestConfig: AxiosRequestConfig = {
        url,
        method,
        baseURL: url,
        headers,
      }

      axiosLogger.logRequest(axiosRequestConfig)
      expect(message).toMatchInlineSnapshot(`
        "
        ┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
          URL: https://doodle.com
          Method: @GET
          Headers:
          ┌
          ├ Content-Type: \\"application/json\\"
          └
        └─────────────────────────────────────────────────────────────────────────────────────────────────────────────"
      `)
    })
  })

  describe(`Axios Logger Request Test Suite`, () => {
    it(`Test simple get request`, () => {
      let message = ''
      const loggerMock: LogFn = (
        msg: string | object,
        ..._args: unknown[]
      ): void => {
        message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(message)
      }
      const log4jsLogger = getLogger('axios')
      log4jsLogger.info = loggerMock
      const axiosLogger = AxiosLogger.from(log4jsLogger)
      const url = 'https://doodle.com'
      const method: Method = 'GET'
      const headers = { 'Content-Type': 'application/json' }
      const params = { firstName: 'John', lastName: 'Wick' }

      const axiosRequestConfig: AxiosRequestConfig = {
        url,
        method,
        baseURL: url,
        headers,
        params,
      }

      axiosLogger.logRequest(axiosRequestConfig)
      expect(message).toMatchInlineSnapshot(`
        "
        ┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
          URL: https://doodle.com?firstName=John&lastName=Wick
          Method: @GET
          Headers:
          ┌
          ├ Content-Type: \\"application/json\\"
          └
        └─────────────────────────────────────────────────────────────────────────────────────────────────────────────"
      `)
    })
    it(`Test simple delete request`, () => {
      let message = ''
      const loggerMock: LogFn = (
        msg: string | object,
        ..._args: unknown[]
      ): void => {
        message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(message)
      }
      const log4jsLogger = getLogger('axios')
      log4jsLogger.info = loggerMock
      const axiosLogger = AxiosLogger.from(log4jsLogger)
      const url = 'https://doodle.com'
      const method: Method = 'DELETE'
      const headers = { 'Content-Type': 'application/json' }
      const params = { firstName: 'John', lastName: 'Wick' }

      const axiosRequestConfig: AxiosRequestConfig = {
        url,
        method,
        baseURL: url,
        headers,
        params,
      }

      axiosLogger.logRequest(axiosRequestConfig)
      expect(message).toMatchInlineSnapshot(`
        "
        ┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
          URL: https://doodle.com?firstName=John&lastName=Wick
          Method: @DELETE
          Headers:
          ┌
          ├ Content-Type: \\"application/json\\"
          └
        └─────────────────────────────────────────────────────────────────────────────────────────────────────────────"
      `)
    })
    it(`Test simple post request`, () => {
      let message = ''
      const loggerMock: LogFn = (
        msg: string | object,
        ..._args: unknown[]
      ): void => {
        message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(message)
      }
      const log4jsLogger = getLogger('axios')
      log4jsLogger.info = loggerMock
      const axiosLogger = AxiosLogger.from(log4jsLogger)
      const url = 'https://doodle.com'
      const method: Method = 'POST'
      const headers = { 'Content-Type': 'application/json' }
      const params = { firstName: 'John', lastName: 'Wick' }
      const body = {
        city: 'Amsterdam',
        console: 'PS4',
        score: 100,
        hobbies: ['games', 'programming', 'tv shows'],
      }
      const axiosRequestConfig: AxiosRequestConfig = {
        url,
        method,
        baseURL: url,
        headers,
        params,
        data: body,
      }

      axiosLogger.logRequest(axiosRequestConfig)
      expect(message).toMatchInlineSnapshot(`
        "
        ┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
          URL: https://doodle.com?firstName=John&lastName=Wick
          Method: @POST
          Headers:
          ┌
          ├ Content-Type: \\"application/json\\"
          └
          Body:
          {
        	\\"city\\": \\"Amsterdam\\",
        	\\"console\\": \\"PS4\\",
        	\\"score\\": 100,
        	\\"hobbies\\": [
        		\\"games\\",
        		\\"programming\\",
        		\\"tv shows\\"
        	]
          }
        └─────────────────────────────────────────────────────────────────────────────────────────────────────────────"
      `)
    })
    it(`Test simple update request`, () => {
      let message = ''
      const loggerMock: LogFn = (
        msg: string | object,
        ..._args: unknown[]
      ): void => {
        message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(message)
      }
      const log4jsLogger = getLogger('axios')
      log4jsLogger.info = loggerMock
      const axiosLogger = AxiosLogger.from(log4jsLogger)
      const url = 'https://doodle.com'
      const method: Method = 'PATCH'
      const headers = { 'Content-Type': 'application/json' }
      const params = { firstName: 'John', lastName: 'Wick' }
      const body = {
        city: 'Amsterdam',
        console: 'PS4',
        score: 100,
        hobbies: ['games', 'programming', 'tv shows'],
      }
      const axiosRequestConfig: AxiosRequestConfig = {
        url,
        method,
        baseURL: url,
        headers,
        params,
        data: body,
      }

      axiosLogger.logRequest(axiosRequestConfig)
      expect(message).toMatchInlineSnapshot(`
        "
        ┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
          URL: https://doodle.com?firstName=John&lastName=Wick
          Method: @PATCH
          Headers:
          ┌
          ├ Content-Type: \\"application/json\\"
          └
          Body:
          {
        	\\"city\\": \\"Amsterdam\\",
        	\\"console\\": \\"PS4\\",
        	\\"score\\": 100,
        	\\"hobbies\\": [
        		\\"games\\",
        		\\"programming\\",
        		\\"tv shows\\"
        	]
          }
        └─────────────────────────────────────────────────────────────────────────────────────────────────────────────"
      `)
    })
    it(`Test that body does not get logged when it's more then allowed`, () => {
      let message = ''
      const loggerMock: LogFn = (
        msg: string | object,
        ..._args: unknown[]
      ): void => {
        message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(message)
      }
      const log4jsLogger = getLogger('axios')
      log4jsLogger.info = loggerMock
      const axiosLogger = AxiosLogger.from(log4jsLogger, {
        request: { maxLogContentLength: 10 },
      })
      const url = 'https://doodle.com'
      const method: Method = 'PATCH'
      const body = {
        city: 'Amsterdam',
        console: 'PS4',
        score: 100,
        hobbies: ['games', 'programming', 'tv shows'],
      }
      const headers = {
        'Content-Type': 'application/json',
        'Content-Length': JSON.stringify(body).length,
      }
      const params = { firstName: 'John', lastName: 'Wick' }

      const axiosRequestConfig: AxiosRequestConfig = {
        url,
        method,
        baseURL: url,
        headers,
        params,
        data: body,
      }

      axiosLogger.logRequest(axiosRequestConfig)
      expect(message).toMatchInlineSnapshot(`
        "
        ┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
          URL: https://doodle.com?firstName=John&lastName=Wick
          Method: @PATCH
          Headers:
          ┌ Content-Type: \\"application/json\\"
          └ Content-Length: \\"93\\"
          Body:
        Body is too long to be displayed. Length: 93 bytes. Max length: 10 bytes.
        └─────────────────────────────────────────────────────────────────────────────────────────────────────────────"
      `)
    })
  })

  describe(`Axios Logger Response Test Suite`, () => {
    it(`Test Response with body`, () => {
      let message = ''
      const loggerMock: LogFn = (
        msg: string | object,
        ..._args: unknown[]
      ): void => {
        message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(message)
      }
      const log4jsLogger = getLogger('axios')
      log4jsLogger.info = loggerMock
      const axiosLogger = AxiosLogger.from(log4jsLogger)
      const url = 'https://doodle.com'
      const method: Method = 'GET'
      const headers = { 'Content-Type': 'application/json' }
      const axiosRequestConfig: AxiosRequestConfig = {
        url,
        method,
        baseURL: url,
        headers,
      }

      const response = { success: true, status: 'DONE' }

      const axiosResponse: AxiosResponse = {
        data: response,
        status: 200,
        statusText: 'SUCCESS',
        headers,
        config: axiosRequestConfig,
        request: axiosRequestConfig,
      }

      axiosLogger.logResponse(axiosResponse)
      expect(message).toMatchInlineSnapshot(`
        "
        ┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
          URL: https://doodle.com
          Method: @GET
          Status: 200  SUCCESS
          Headers
          ┌
          ├ Content-Type: \\"application/json\\"
          └
          Body:
          {
        	\\"success\\": true,
        	\\"status\\": \\"DONE\\"
          }
        └─────────────────────────────────────────────────────────────────────────────────────────────────────────────"
      `)
    })
    it(`Test that body does not get logged when it's more then allowed`, () => {
      let message = ''
      const loggerMock: LogFn = (
        msg: string | object,
        ..._args: unknown[]
      ): void => {
        message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(message)
      }
      const log4jsLogger = getLogger('axios')
      log4jsLogger.info = loggerMock
      const axiosLogger = AxiosLogger.from(log4jsLogger, {
        response: { maxLogContentLength: 10 },
      })
      const url = 'https://doodle.com'
      const method: Method = 'GET'
      const headers = {
        'Content-Type': 'application/json',
        'Content-Length': '100',
      }
      const axiosRequestConfig: AxiosRequestConfig = {
        url,
        method,
        baseURL: url,
        headers,
      }

      const response = { success: true, status: 'DONE' }

      const axiosResponse: AxiosResponse = {
        data: response,
        status: 200,
        statusText: 'SUCCESS',
        headers,
        config: axiosRequestConfig,
        request: axiosRequestConfig,
      }

      axiosLogger.logResponse(axiosResponse)
      expect(message).toMatchInlineSnapshot(`
        "
        ┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
          URL: https://doodle.com
          Method: @GET
          Status: 200  SUCCESS
          Headers
          ┌ Content-Type: \\"application/json\\"
          └ Content-Length: \\"100\\"
          Body:
        Body is too long to be displayed. Length: 100 bytes. Max length: 10 bytes.
        └─────────────────────────────────────────────────────────────────────────────────────────────────────────────"
      `)
    })

    it(`Test Response without body`, () => {
      let message = ''
      const loggerMock: LogFn = (
        msg: string | object,
        ..._args: unknown[]
      ): void => {
        message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(message)
      }
      const log4jsLogger = getLogger('axios')
      log4jsLogger.info = loggerMock
      const axiosLogger = AxiosLogger.from(log4jsLogger)
      const url = 'https://doodle.com'
      const method: Method = 'GET'
      const headers = { 'Content-Type': 'application/json' }
      const axiosRequestConfig: AxiosRequestConfig = {
        url,
        method,
        baseURL: url,
        headers,
      }

      const axiosResponse: AxiosResponse = {
        data: null,
        status: 200,
        statusText: 'SUCCESS',
        headers,
        config: axiosRequestConfig,
        request: axiosRequestConfig,
      }

      axiosLogger.logResponse(axiosResponse)
      expect(message).toMatchInlineSnapshot(`
        "
        ┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
          URL: https://doodle.com
          Method: @GET
          Status: 200  SUCCESS
          Headers
          ┌
          ├ Content-Type: \\"application/json\\"
          └
          Body:
          {}
        └─────────────────────────────────────────────────────────────────────────────────────────────────────────────"
      `)
    })
  })

  describe(`Axios Logger Error Test Suite`, () => {
    it(`Test Log Request Error`, (done) => {
      let message: object | string | undefined = ''
      const infoLogMock: LogFn = (
        msg: string | object,
        ..._args: unknown[]
      ): void => {
        message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(message)
      }
      const errorLogMock: LogFn = (
        obj: object | string,
        ..._args: unknown[]
      ): void => {
        message = obj
        const expectedMessage = `
  ┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
    URL: bla
    Method: @GET
    Headers:
    ┌ Accept: "application/json, text/plain, */*"
    └ User-Agent: "axios/0.21.4"
  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────
  ┌────── Response Error ──────────────────────────────────────────────────────────────────────────────────────────────
    Code: ECONNREFUSED
    Message: @connect ECONNREFUSED 127.0.0.1:80
    StackTrace: @Error: connect ECONNREFUSED 127.0.0.1:80
      at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1134:16)
  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────`.replace(
          /net\.js:\d*:\d*/gi,
          '1'
        )
        message = (message as string).replace(/net\.js:\d*:\d*/gi, '1') // different node versions have different lint number
        expect(message).toEqual(expectedMessage)
        logger.error(message)
      }
      const axiosLogger = new AxiosLogger(infoLogMock, errorLogMock)
      const instance = axios.create()
      instance.interceptors.request.use(undefined, (err: AxiosError) => {
        axiosLogger.logErrorDetails(err)
        return Promise.reject(err)
      })
      instance.interceptors.response.use(undefined, (err: AxiosError) => {
        axiosLogger.logErrorDetails(err)
        return Promise.reject(err)
      })
      instance
        .get('bla')
        .then(() => {
          console.log(`hello`)
        })
        .catch((e: { stack: string }) => {
          if (e.stack.includes('AssertionError')) {
            done(e)
          } else {
            done()
          }
        })
    })
  })

  describe(`Axios Integration Test Suite`, () => {
    it(`I can see both request and response logged properly in real axios`, async () => {
      const instance = axios.create()
      const axiosLogger = AxiosLogger.default()
      instance.interceptors.request.use(
        (config) => {
          axiosLogger.logRequest(config)
          return config
        },
        (error) => {
          axiosLogger.logErrorDetails(error)
          return Promise.reject(error)
        }
      )
      instance.interceptors.response.use(
        (response) => {
          axiosLogger.logResponse(response)
          return response
        },
        (error) => {
          axiosLogger.logErrorDetails(error)
          return Promise.reject(error)
        }
      )
      await instance
        .get('https://jsonplaceholder.typicode.com/users')
        .then(({ data }) => {
          expect(data).not.toBeNull()
        })
    })
  })

  describe(`Contentful Integration Test Suite`, () => {
    it(`I can see both request and response logged properly in real axios from contentful example`, (done) => {
      const config = {
        url: 'entries',
        method: 'get' as Method,
        baseURL:
          'https://cdn.contentful.com:443/spaces/ctqb7xehjnk4/environments/prod-v4',
        headers: {
          common: {
            Accept: 'application/json, text/plain, */*',
          },
          delete: {},
          get: {},
          head: {},
          post: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          put: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          patch: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          'Content-Type': 'application/vnd.contentful.delivery.v1+json',
          'X-Contentful-User-Agent':
            'sdk contentful.js/0.0.0-determined-by-semantic-release; platform node.js/v12.18.3; os macOS/19.6.0;',
          Authorization: 'Bearer <>',
          'user-agent': 'node.js/v12.18.3',
          'Accept-Encoding': 'gzip',
          'x-contentful-route':
            '/spaces/:space/environments/:environment/entries',
        },
        params: {
          content_type: 'drinkTag',
        },
        auth: undefined,
      }
      let capturedMsg = ''
      const loggerMock: LogFn = (
        msg: string | object,
        ..._args: unknown[]
      ): void => {
        capturedMsg =
          typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(capturedMsg)
      }
      const log4jsLogger = getLogger('axios')
      log4jsLogger.info = loggerMock

      const axiosLogger = AxiosLogger.using(
        log4jsLogger.info.bind(log4jsLogger),
        log4jsLogger.error.bind(log4jsLogger)
      )
      axiosLogger.logRequest(config as unknown as AxiosRequestConfig)
      expect(capturedMsg).toMatchInlineSnapshot(`
        "
        ┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
          URL: https://cdn.contentful.com:443/spaces/ctqb7xehjnk4/environments/prod-v4/entries?content_type=drinkTag
          Method: @GET
          Headers:
          ├ Content-Type: \\"application/vnd.contentful.delivery.v1+json\\"
          ├ X-Contentful-User-Agent: \\"sdk contentful.js/0.0.0-determined-by-semantic-release; platform node.js/v12.18.3; os macOS/19.6.0;\\"
          ├ Authorization: \\"Bearer <>\\"
          ├ user-agent: \\"node.js/v12.18.3\\"
          ├ Accept-Encoding: \\"gzip\\"
          ├ x-contentful-route: \\"https://cdn.contentful.com:443/spaces/ctqb7xehjnk4/environments/prod-v4/spaces/:space/environments/:environment/entries\\"
          └ Accept: \\"application/json, text/plain, */*\\"
        └─────────────────────────────────────────────────────────────────────────────────────────────────────────────"
      `)
      done()
    })
  })

  describe(`Axios Logging Configuration Test Suite`, () => {
    it.each([
      [
        `Default config`,
        defaultConfig(),
        `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Headers:
  ┌
  ├ Content-Type: "application/json"
  └
  Body:
  {
\t"hello": "world"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────

┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Status: 200  SUCCESS
  Headers
  ┌
  ├ Content-Type: "application/json"
  └
  Body:
  {
\t"status": "success"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`,
      ],
      [
        `Do not log request body`,
        { request: { shouldLogBody: false } },
        `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Headers:
  ┌
  ├ Content-Type: "application/json"
  └
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────

┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Status: 200  SUCCESS
  Headers
  ┌
  ├ Content-Type: "application/json"
  └
  Body:
  {
\t"status": "success"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`,
      ],
      [
        `Do not log request headers`,
        { request: { shouldLogHeaders: false } },
        `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Body:
  {
\t"hello": "world"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────

┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Status: 200  SUCCESS
  Headers
  ┌
  ├ Content-Type: "application/json"
  └
  Body:
  {
\t"status": "success"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`,
      ],
      [
        `Do not log response body`,
        { response: { shouldLogBody: false } },
        `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Headers:
  ┌
  ├ Content-Type: "application/json"
  └
  Body:
  {
\t"hello": "world"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────

┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Status: 200  SUCCESS
  Headers
  ┌
  ├ Content-Type: "application/json"
  └
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`,
      ],
      [
        `Do not log response headers`,
        { response: { shouldLogHeaders: false } },
        `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Headers:
  ┌
  ├ Content-Type: "application/json"
  └
  Body:
  {
\t"hello": "world"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────

┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Status: 200  SUCCESS
  Body:
  {
\t"status": "success"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`,
      ],
      [
        `Do not log request/response body and headers`,
        {
          request: { shouldLogHeaders: false, shouldLogBody: false },
          response: { shouldLogHeaders: false, shouldLogBody: false },
        },
        `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────

┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Status: 200  SUCCESS
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`,
      ],
    ])(`%s`, (title, config, expected) => {
      let messages: Array<string> = []
      const loggerMock: LogFn = (
        msg: string | object,
        ..._args: unknown[]
      ): void => {
        const message =
          typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        messages = [...messages, message]
        logger.info(message)
      }
      const log4jsLogger = getLogger('axios')
      log4jsLogger.info = loggerMock
      const axiosLogger = AxiosLogger.from(log4jsLogger, config)
      const url = 'https://doodle.com'
      const method: Method = 'POST'
      const headers = { 'Content-Type': 'application/json' }
      const axiosRequestConfig: AxiosRequestConfig = {
        url,
        method,
        baseURL: url,
        headers,
        data: { hello: 'world' },
      }

      const axiosResponse: AxiosResponse = {
        data: { status: 'success' },
        status: 200,
        statusText: 'SUCCESS',
        headers,
        config: axiosRequestConfig,
        request: axiosRequestConfig,
      }

      axiosLogger.logRequest(axiosRequestConfig)
      axiosLogger.logResponse(axiosResponse)
      expect(messages.join('\n')).toEqual(expected)
    })
  })
})
