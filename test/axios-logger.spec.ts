import { params, suite, test } from '@testdeck/mocha'
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method
} from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { expect } from 'chai'
import { LogFn } from 'pino'
import { AxiosLogger, indent } from '../src/axios-logger'
import { logger } from '../src/logger/logger'
import log4js from 'log4js'

describe('Axios Logger Test Suite', () => {
  log4js.configure({
    appenders: {
      axios: { type: 'console', layout: { type: 'colored' }, level: 'debug' }
    },
    categories: { default: { appenders: ['axios'], level: 'debug' } }
  })

  @suite('Axios Logger Utilities Test Suite')
  class AxiosLoggerTestSuite extends AxiosLogger {
    @test
    public 'Test that starting line of request/response is displayed properly'() {
      const name = 'Request'
      expect(this.startingLine(name)).to.equal(
        `┌────── ${name} ──────────────────────────────────────────────────────────────────────────────────────────────`
      )
    }

    @test
    public 'Test that ending line of request/response is displayed properly'() {
      expect(this.endingLine()).to.equal(
        `└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`
      )
    }
  }

  @suite('Axios Logger Request Test Suite')
  class AxiosLoggerRequestTestSuite extends AxiosLogger {
    @test
    public 'Test simple get request'() {
      let message: string = ''
      const loggerMock: LogFn = (
        msg: string | object,
        ...args: any[]
      ): void => {
        message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(message)
      }
      const log4jsLogger = log4js.getLogger('axios')
      log4jsLogger.info = loggerMock
      const axiosLogger = AxiosLogger.from(log4jsLogger)
      const url = 'https://doodle.com'
      const method: Method = 'GET'
      const headers = { 'Content-Type': 'application/json' }
      const axiosRequestConfig: AxiosRequestConfig = {
        url,
        method,
        baseURL: url,
        headers
      }

      axiosLogger.logRequest(axiosRequestConfig)
      const expectedMessage = `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: ${url}
  Method: @${method}
  Headers:
  ┌
  ├ Content-Type: "application/json"
  └
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`
      expect(message).to.equal(expectedMessage)
    }

    @test
    public 'Test simple post request'() {
      let message: string = ''
      const loggerMock: LogFn = (
        msg: string | object,
        ...args: any[]
      ): void => {
        message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(message)
      }
      const log4jsLogger = log4js.getLogger('axios')
      log4jsLogger.info = loggerMock
      const axiosLogger = AxiosLogger.from(log4jsLogger)
      const url = 'https://doodle.com'
      const method: Method = 'POST'
      const headers = { 'Content-Type': 'application/json' }
      const parameters = { firstName: 'John', lastName: 'Wick' }
      const body = {
        city: 'Amsterdam',
        console: 'PS4',
        score: 100,
        hobbies: ['games', 'programming', 'tv shows']
      }
      const axiosRequestConfig: AxiosRequestConfig = {
        url,
        method,
        baseURL: url,
        headers,
        params: parameters,
        data: body
      }

      axiosLogger.logRequest(axiosRequestConfig)
      const expectedMessage = `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: ${url}
  Method: @${method}
  Headers:
  ┌
  ├ Content-Type: "application/json"
  └
  Body:
  {
\t"city": "Amsterdam",
\t"console": "PS4",
\t"score": 100,
\t"hobbies": [
\t\t"games",
\t\t"programming",
\t\t"tv shows"
\t]
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`
      expect(message).to.equal(expectedMessage)
    }
  }

  @suite('Axios Logger Response Test Suite')
  class AxiosLoggerResponseTestSuite extends AxiosLogger {
    @test
    public 'Test Response with body'() {
      let message: string = ''
      const loggerMock: LogFn = (
        msg: string | object,
        ...args: any[]
      ): void => {
        message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(message)
      }
      const log4jsLogger = log4js.getLogger('axios')
      log4jsLogger.info = loggerMock
      const axiosLogger = AxiosLogger.from(log4jsLogger)
      const url = 'https://doodle.com'
      const method: Method = 'GET'
      const headers = { 'Content-Type': 'application/json' }
      const axiosRequestConfig: AxiosRequestConfig = {
        url,
        method,
        baseURL: url,
        headers
      }

      const response = { success: true, status: 'DONE' }

      const axiosResponse: AxiosResponse = {
        data: response,
        status: 200,
        statusText: 'SUCCESS',
        headers,
        config: axiosRequestConfig,
        request: axiosRequestConfig
      }

      axiosLogger.logResponse(axiosResponse)
      const expectedMessage = `
┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @GET
  Status: 200  SUCCESS
  Headers
  ┌
  ├ Content-Type: "application/json"
  └
  Body:
  {
	"success": true,
	"status": "DONE"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`
      expect(message).to.equal(expectedMessage)
    }

    @test
    public 'Test Response without body'() {
      let message: string = ''
      const loggerMock: LogFn = (
        msg: string | object,
        ...args: any[]
      ): void => {
        message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(message)
      }
      const log4jsLogger = log4js.getLogger('axios')
      log4jsLogger.info = loggerMock
      const axiosLogger = AxiosLogger.from(log4jsLogger)
      const url = 'https://doodle.com'
      const method: Method = 'GET'
      const headers = { 'Content-Type': 'application/json' }
      const axiosRequestConfig: AxiosRequestConfig = {
        url,
        method,
        baseURL: url,
        headers
      }

      const axiosResponse: AxiosResponse = {
        data: null,
        status: 200,
        statusText: 'SUCCESS',
        headers,
        config: axiosRequestConfig,
        request: axiosRequestConfig
      }

      axiosLogger.logResponse(axiosResponse)
      const expectedMessage = `
┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @GET
  Status: 200  SUCCESS
  Headers
  ┌
  ├ Content-Type: "application/json"
  └
  Body:
  {}
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`
      expect(message).to.equal(expectedMessage)
    }
  }

  @suite('Axios Logger Error Test Suite')
  class AxiosLoggerErrorTestSuite extends AxiosLogger {
    @test
    public 'Test Log Request Error'(done) {
      let message: object | string | undefined = ''
      const infoLogMock: LogFn = (
        msg: string | object,
        ...args: any[]
      ): void => {
        message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(message)
      }
      const errorLogMock: LogFn = (
        obj: object | string,
        msg?: string,
        ...args: any[]
      ): void => {
        message = obj
        const expectedMessage = `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: bla
  Method: @GET
  Headers:
  ┌ Accept: "application/json, text/plain, */*"
  └ User-Agent: "axios/0.20.0"
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
        expect(message).to.equal(expectedMessage)
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
        .then(resp => {})
        .catch(e => {
          if (e.stack.includes('AssertionError')) {
            done(e)
          } else {
            done()
          }
        })
    }

    @test
    public 'Test Log Response Error'(done) {
      let message: string | undefined = ''
      const infoLogMock: LogFn = (
        msg: string | object,
        ...args: any[]
      ): void => {
        message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
        logger.info(message)
      }
      const errorLogMock: LogFn = (
        obj: object | string,
        msg?: string,
        ...args: any[]
      ): void => {
        let baseDir = __dirname.replace('/test', '')
        const expectedMessage = `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: /users
  Method: @GET
  Headers:
  ┌ Accept: "application/json, text/plain, */*"
  └ Authorization: "Bla"
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────

┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: /users
  Method: @GET
  Status: 400  undefined
  Headers
  ┌
  ├ Content: "application/json"
  └
  Body:
  {
\t"error": "Failure"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌────── Response Error ──────────────────────────────────────────────────────────────────────────────────────────────
  Message: @Request failed with status code 400
  StackTrace: @Error: Request failed with status code 400
    at createAxiosError (${baseDir}/node_modules/axios-mock-adapter/src/utils.js:148:15)
    at Object.settle (${baseDir}/node_modules/axios-mock-adapter/src/utils.js:127:9)
    at handleRequest (${baseDir}/node_modules/axios-mock-adapter/src/handle_request.js:67:13)
    at ${baseDir}/node_modules/axios-mock-adapter/src/index.js:26:9
    at new Promise (<anonymous>)
    at MockAdapter.<anonymous> (${baseDir}/node_modules/axios-mock-adapter/src/index.js:25:14)
    at dispatchRequest (${baseDir}/node_modules/axios/lib/core/dispatchRequest.js:52:10)
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`
        expect(obj).to.equal(expectedMessage)
        logger.error(obj)
      }
      const axiosLogger = new AxiosLogger(infoLogMock, errorLogMock)
      const instance = axios.create()
      const axiosMock = new MockAdapter(instance)
      axiosMock
        .onGet('/users')
        .reply(400, { error: 'Failure' }, { Content: 'application/json' })
      instance.interceptors.request.use(
        config => {
          config.headers.Authorization = 'Bla'
          return config
        },
        (err: AxiosError) => {
          axiosLogger.logErrorDetails(err)
          return Promise.reject(err)
        }
      )
      instance.interceptors.response.use(undefined, (err: AxiosError) => {
        axiosLogger.logErrorDetails(err)
        return Promise.reject(err)
      })
      instance
        .get('/users')
        .then(resp => {
          done()
        })
        .catch(error => {
          if (error.stack.includes('AssertionError')) {
            done(error)
          } else {
            done()
          }
        })
    }
  }

  @suite('Test Body Formatter')
  class BodyPrettyFormatterTestSuite extends AxiosLogger {
    @params(
      {
        body: '{"name":"John","lastName":"Wick"}',
        expectedResult: `${indent}{
\t"name": "John",
\t"lastName": "Wick"
${indent}}`
      },
      'Body object as string'
    )
    @params(
      {
        body: { name: 'John', lastName: 'Wick' },
        expectedResult: `${indent}{
\t"name": "John",
\t"lastName": "Wick"
${indent}}`
      },
      'Body as string'
    )
    @params(
      {
        body: 'Hello how are you?',
        expectedResult: `${indent}Hello how are you?`
      },
      'Body object as simple string'
    )
    public 'Test Pretty Formatting Of Body'({ body, expectedResult }) {
      const formattedBody = this.prettyFormatBody(body)
      expect(formattedBody).to.equal(expectedResult)
    }
  }

  @suite('Test Single Header Entry Pretty Formatting')
  class HeaderEntryPrettyFormatterTestSuite extends AxiosLogger {
    @params(
      {
        headerEntry: { key: 'Accept-Content', value: 'application-json' },
        isFirstElement: true,
        isLastElement: false,
        expectedResult: `${indent}┌ Accept-Content: "application-json"`
      },
      'First header entry'
    )
    @params(
      {
        headerEntry: { key: 'Accept-Content', value: 'application-json' },
        isFirstElement: false,
        isLastElement: false,
        expectedResult: `${indent}├ Accept-Content: "application-json"`
      },
      'Middle header entry'
    )
    @params(
      {
        headerEntry: { key: 'Accept-Content', value: 'application-json' },
        isFirstElement: false,
        isLastElement: true,
        expectedResult: `${indent}└ Accept-Content: "application-json"`
      },
      'Last header entry'
    )
    @params(
      {
        headerEntry: { key: 'Accept-Content', value: 'application-json' },
        isFirstElement: true,
        isLastElement: true,
        expectedResult: `${indent}┌\n${indent}├ Accept-Content: "application-json"\n${indent}└`
      },
      'Single header entry'
    )
    public 'Test how we print headers entry in a pretty format'({
      headerEntry,
      isFirstElement,
      isLastElement,
      expectedResult
    }) {
      expect(
        this.prettyHeaderEntry(headerEntry, isFirstElement, isLastElement)
      ).to.eq(expectedResult)
    }
  }

  @suite('Test Multiple Header Entries Pretty Formatting')
  class MultipleHeaderEntriesFormattingTestSuite extends AxiosLogger {
    @params(
      {
        headers: { 'Accept-Content': 'application/json' },
        expectedResult: `${indent}┌\n${indent}├ Accept-Content: "application/json"\n${indent}└`
      },
      'Simple accept-content header'
    )
    @params(
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application-json'
        },
        expectedResult: `${indent}┌ Accept: "application/json"\n${indent}└ Content-Type: "application-json"`
      },
      'Two records'
    )
    @params(
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'new10-integration-tests/v1',
          'Content-Type': 'application-json'
        },
        expectedResult: `${indent}┌ Accept: "application/json"\n${indent}├ User-Agent: "new10-integration-tests/v1"\n${indent}└ Content-Type: "application-json"`
      },
      'Three records'
    )
    @params(
      {
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer eyJraWQiOiI0WFpyUTlXZUlnZEVBR1d3eFFTYWFvTmFrVGtHZmpEU1VqbU0rTnVoeWkwPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3ZmhwbjFxN2hkcmt0bmNmNWhyZXVkM25rZSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiaHR0cHM6XC9cL2F1dGguZGV2Lm5ldzEwLmlvXC9kZWZhdWx0IiwiYXV0aF90aW1lIjoxNTk5NTc0NjgxLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9XdnJ0NnJod3oiLCJleHAiOjE1OTk1NzgyODEsImlhdCI6MTU5OTU3NDY4MSwidmVyc2lvbiI6MiwianRpIjoiM2MwMjQ3YjEtYjFhMy00ZTkxLTk4NWQtMGI4NTdlODI1ODg5IiwiY2xpZW50X2lkIjoiN2ZocG4xcTdoZHJrdG5jZjVocmV1ZDNua2UifQ.N673oUZdpbt_5qMa44VQGGwlBuhzPVoKqwE7aHzOlPc021f4pnXFEA4HGqOmk3-W5_gopwJJV0RaVaB3Xq_Zp49xEDC1dTllSGXCgK-Ywa-isqyREYPmC8vq9uatGtlNKx_uOC5GK9LEh72wzB6uuQ4DKL-Y8U7OG1onppSEKKS-jSeVHa1WdJ-BhAiqv1t2VofhI72S_Wko8kjGeXKfA3HLUGjem2lKeTV59Fl3t8d70XcB30ODXB-YVUL3L95GqLcTxRDwY5ANHGbfhEPBXUpPgmiq-THSPL0eyxqs0-MjzD_kzvzRDEEy4K3JKlhtcQeguuQuKZZTg',
          'User-Agent': 'new10-integration-tests/v1',
          'Content-Type': 'application-json'
        },
        expectedResult: `${indent}┌ Accept: "application/json"\n${indent}├ Authorization: "Bearer eyJraWQiOiI0WFpyUTlXZUlnZEVBR1d3eFFTYWFvTmFrVGtHZmpEU1VqbU0rTnVoeWkwPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3ZmhwbjFxN2hkcmt0bmNmNWhyZXVkM25rZSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiaHR0cHM6XC9cL2F1dGguZGV2Lm5ldzEwLmlvXC9kZWZhdWx0IiwiYXV0aF90aW1lIjoxNTk5NTc0NjgxLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9XdnJ0NnJod3oiLCJleHAiOjE1OTk1NzgyODEsImlhdCI6MTU5OTU3NDY4MSwidmVyc2lvbiI6MiwianRpIjoiM2MwMjQ3YjEtYjFhMy00ZTkxLTk4NWQtMGI4NTdlODI1ODg5IiwiY2xpZW50X2lkIjoiN2ZocG4xcTdoZHJrdG5jZjVocmV1ZDNua2UifQ.N673oUZdpbt_5qMa44VQGGwlBuhzPVoKqwE7aHzOlPc021f4pnXFEA4HGqOmk3-W5_gopwJJV0RaVaB3Xq_Zp49xEDC1dTllSGXCgK-Ywa-isqyREYPmC8vq9uatGtlNKx_uOC5GK9LEh72wzB6uuQ4DKL-Y8U7OG1onppSEKKS-jSeVHa1WdJ-BhAiqv1t2VofhI72S_Wko8kjGeXKfA3HLUGjem2lKeTV59Fl3t8d70XcB30ODXB-YVUL3L95GqLcTxRDwY5ANHGbfhEPBXUpPgmiq-THSPL0eyxqs0-MjzD_kzvzRDEEy4K3JKlhtcQeguuQuKZZTg"\n${indent}├ User-Agent: "new10-integration-tests/v1"\n${indent}└ Content-Type: "application-json"`
      },
      'Four records with long authorization header'
    )
    @params(
      {
        headers: {
          'Accept-Content': 'application/json',
          common: { Authorization: 'Bla test', RequestTraceId: 'Bla-123-123' }
        },
        expectedResult: `${indent}┌ Accept-Content: "application/json"
  ├ Authorization: "Bla test"
  └ RequestTraceId: "Bla-123-123"`
      },
      'Headers with common headers values'
    )
    @params(
      {
        headers: undefined,
        expectedResult: ``
      },
      'Headers are undefined'
    )
    public 'Test headers parsing'({ headers, expectedResult }) {
      const parsedHeader = this.parseHeaders(headers)
      logger.info(`Headers: \n${parsedHeader}`)
      expect(parsedHeader).to.equal(expectedResult)
    }
  }

  @suite('Axios Integration Test Suite')
  class AxiosIntegrationTest extends AxiosLogger {
    @test 'I can see both request and response logged properly in real axios'(
      done
    ) {
      const instance = axios.create()
      const axiosLogger = AxiosLogger.default()
      instance.interceptors.request.use(
        config => {
          axiosLogger.logRequest(config)
          return config
        },
        error => {
          axiosLogger.logErrorDetails(error)
          return Promise.reject(error)
        }
      )
      instance.interceptors.response.use(
        response => {
          axiosLogger.logResponse(response)
          return response
        },
        error => {
          axiosLogger.logErrorDetails(error)
          return Promise.reject(error)
        }
      )
      instance
        .get('https://jsonplaceholder.typicode.com/users')
        .then(({ data }) => {
          expect(data).to.not.be.null
          done()
        })
    }
  }
})
