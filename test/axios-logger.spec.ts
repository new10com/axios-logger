import { suite, test } from '@testdeck/mocha'
import axios, {
    AxiosAdapter,
    AxiosBasicCredentials,
    AxiosError, AxiosProxyConfig,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosTransformer, CancelToken,
    Method, ResponseType,
} from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { expect } from 'chai'
import log4js from 'log4js'
import { AxiosLogger, LogFn } from '../src/axios-logger'
import { logger } from '../src/logger/logger'

describe('Axios Logger Test Suite', () => {
    log4js.configure({
        appenders: {
            axios: { type: 'console', layout: { type: 'colored' }, level: 'debug' },
        },
        categories: { default: { appenders: ['axios'], level: 'debug' } },
    })

    @suite('Axios Logger Constructor Test Suite')
    class AxiosLoggerConstructorTestSuite extends AxiosLogger {
        @test
        'Test "using" static factory method'() {
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
            const axiosLogger = AxiosLogger.using(log4jsLogger.info, log4jsLogger.error)
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
        'Test simple post request'() {
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
                hobbies: ['games', 'programming', 'tv shows'],
            }
            const axiosRequestConfig: AxiosRequestConfig = {
                url,
                method,
                baseURL: url,
                headers,
                params: parameters,
                data: body,
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

    @suite('Axios Logger Request Test Suite')
    class AxiosLoggerRequestTestSuite extends AxiosLogger {
        @test
        'Test simple get request'() {
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
                headers,
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
        'Test simple post request'() {
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
                hobbies: ['games', 'programming', 'tv shows'],
            }
            const axiosRequestConfig: AxiosRequestConfig = {
                url,
                method,
                baseURL: url,
                headers,
                params: parameters,
                data: body,
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
        'Test Response with body'() {
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
        'Test Response without body'() {
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
        'Test Log Request Error'(done) {
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
                    '1',
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
                .then(resp => {
                })
                .catch(e => {
                    if (e.stack.includes('AssertionError')) {
                        done(e)
                    } else {
                        done()
                    }
                })
        }

        @test
        'Test Log Response Error'(done) {
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
                const baseDir = __dirname.replace('/test', '')
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
                },
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

    @suite('Axios Integration Test Suite')
    class AxiosIntegrationTest extends AxiosLogger {
        @test 'I can see both request and response logged properly in real axios'(
            done,
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
                },
            )
            instance.interceptors.response.use(
                response => {
                    axiosLogger.logResponse(response)
                    return response
                },
                error => {
                    axiosLogger.logErrorDetails(error)
                    return Promise.reject(error)
                },
            )
            instance
                .get('https://jsonplaceholder.typicode.com/users')
                .then(({ data }) => {
                    expect(data).to.not.be.null
                    done()
                })
        }
    }

    @suite('Contentful Integration Test Suite')
    class ContentfulIntegrationTest extends AxiosLogger {
        @test 'I can see both request and response logged properly in real axios from contentful example'(
            done,
        ) {
            const config = {
                url: 'entries',
                method: 'get' as Method,
                baseURL: 'https://cdn.contentful.com:443/spaces/ctqb7xehjnk4/environments/prod-v4',
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
                    'X-Contentful-User-Agent': 'sdk contentful.js/0.0.0-determined-by-semantic-release; platform node.js/v12.18.3; os macOS/19.6.0;',
                    Authorization: 'Bearer <>',
                    'user-agent': 'node.js/v12.18.3',
                    'Accept-Encoding': 'gzip',
                    'x-contentful-route': '/spaces/:space/environments/:environment/entries'
                },
                params: {
                    content_type: 'drinkTag',
                },
                auth: undefined
            }
            let capturedMsg: string = ''
            const loggerMock: LogFn = (
                msg: string | object,
                ...args: any[]
            ): void => {
                capturedMsg = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
                logger.info(capturedMsg)
            }
            const log4jsLogger = log4js.getLogger('axios')
            log4jsLogger.info = loggerMock

            const axiosLogger = AxiosLogger.using(log4jsLogger.info, log4jsLogger.error)
            axiosLogger.logRequest(config)
            const expectedMsg = `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://cdn.contentful.com:443/spaces/ctqb7xehjnk4/environments/prod-v4/entries
  Method: @GET
  Headers:
  ├ Content-Type: "application/vnd.contentful.delivery.v1+json"
  ├ X-Contentful-User-Agent: "sdk contentful.js/0.0.0-determined-by-semantic-release; platform node.js/v12.18.3; os macOS/19.6.0;"
  ├ Authorization: "Bearer <>"
  ├ user-agent: "node.js/v12.18.3"
  ├ Accept-Encoding: "gzip"
  ├ x-contentful-route: "https://cdn.contentful.com:443/spaces/ctqb7xehjnk4/environments/prod-v4/spaces/:space/environments/:environment/entries"
  └ Accept: "application/json, text/plain, */*"
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`
            expect(capturedMsg).to.equal(expectedMsg)
            done()
        }
    }
})
