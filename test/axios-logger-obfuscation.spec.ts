import log4js from 'log4js'
import { params, suite } from '@testdeck/mocha'
import { AxiosLogger, LogFn } from '../src/axios-logger'
import { logger } from '../src/logger/logger'
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { expect } from 'chai'
import { defaultConfig } from '../src/config/axios-logger-config'
import { DEFAULT_REDACTABLE_KEYS } from '../src/constants/constants'
import { getRedactableKeys } from '../src/obfuscator/obfuscator'

describe('Axios Logger Obfuscation Test Suite', () => {
        log4js.configure({
            appenders: {
                axios: { type: 'console', layout: { type: 'colored' }, level: 'debug' },
            },
            categories: { default: { appenders: ['axios'], level: 'debug' } },
        })

        @suite('Axios Logger Obfuscation Test Suite')
        class AxiosLoggerObfuscationTestSuite extends AxiosLogger {
            @params(
                {
                    bodyIsValidJson: true,
                    bodyAsString: false,
                    config: defaultConfig(),
                    expectedLog: `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Headers:
  ┌ Content-Type: "application/json"
  └ Authorization: "Bearer superSecretCode"
  Body:
  {
\t"firstName": "John",
\t"lastName": "Wick",
\t"username": "johnwick",
\t"password": "iReallyLoveDogsAndGuns",
\t"token": "JohnWick123123"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────

┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Status: 200  SUCCESS
  Headers
  ┌ Content-Type: "application/json"
  └ Authorization: "Bearer superSecretCode"
  Body:
  {
\t"firstName": "John",
\t"lastName": "Wick",
\t"username": "johnwick",
\t"password": "iReallyLoveDogsAndGuns",
\t"token": "JohnWick123123"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`,
                },
                'By default obfuscation is disabled',
            )
            @params(
                {
                    bodyIsValidJson: true,
                    bodyAsString: false,
                    config: { obfuscation: { obfuscate: true } },
                    expectedLog: `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Headers:
  ┌ Content-Type: "application/json"
  └ Authorization: "[ REDACTED ]"
  Body:
  {
\t"firstName": "John",
\t"lastName": "Wick",
\t"username": "johnwick",
\t"password": "[ REDACTED ]",
\t"token": "[ REDACTED ]"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────

┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Status: 200  SUCCESS
  Headers
  ┌ Content-Type: "application/json"
  └ Authorization: "[ REDACTED ]"
  Body:
  {
\t"firstName": "John",
\t"lastName": "Wick",
\t"username": "johnwick",
\t"password": "[ REDACTED ]",
\t"token": "[ REDACTED ]"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`,
                },
                'Test that enabled obfuscation default keys are obfuscated',
            )
            @params(
                {
                    bodyIsValidJson: true,
                    bodyAsString: false,
                    config: {
                        obfuscation: {
                            obfuscate: true,
                            redactableKeys: ['Authorization', 'username', 'password'],
                        },
                    },
                    expectedLog: `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Headers:
  ┌ Content-Type: "application/json"
  └ Authorization: "[ REDACTED ]"
  Body:
  {
\t"firstName": "John",
\t"lastName": "Wick",
\t"username": "[ REDACTED ]",
\t"password": "[ REDACTED ]",
\t"token": "JohnWick123123"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────

┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Status: 200  SUCCESS
  Headers
  ┌ Content-Type: "application/json"
  └ Authorization: "[ REDACTED ]"
  Body:
  {
\t"firstName": "John",
\t"lastName": "Wick",
\t"username": "[ REDACTED ]",
\t"password": "[ REDACTED ]",
\t"token": "JohnWick123123"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`,
                },
                'Test that obfuscation fields can be configured',
            )
            @params(
                {
                    bodyIsValidJson: true,
                    bodyAsString: true,
                    config: {
                        obfuscation: {
                            obfuscate: true,
                            redactableKeys: ['Authorization', 'username', 'password'],
                        },
                    },
                    expectedLog: `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Headers:
  ┌ Content-Type: "application/json"
  └ Authorization: "[ REDACTED ]"
  Body:
  {
\t"firstName": "John",
\t"lastName": "Wick",
\t"username": "[ REDACTED ]",
\t"password": "[ REDACTED ]",
\t"token": "JohnWick123123"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────

┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Status: 200  SUCCESS
  Headers
  ┌ Content-Type: "application/json"
  └ Authorization: "[ REDACTED ]"
  Body:
  {
\t"firstName": "John",
\t"lastName": "Wick",
\t"username": "[ REDACTED ]",
\t"password": "[ REDACTED ]",
\t"token": "JohnWick123123"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`,
                },
                'Test that obfuscation works when body is a string',
            )
            @params(
                {
                    bodyIsValidJson: false,
                    bodyAsString: true,
                    config: {
                        obfuscation: {
                            obfuscate: true,
                            redactableKeys: ['Authorization', 'username', 'password'],
                        },
                    },
                    expectedLog: `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Headers:
  ┌ Content-Type: "application/json"
  └ Authorization: "[ REDACTED ]"
  Body:
{"firstName":"John","lastName":"Wick","username":"johnwick","password":"iReallyLoveDogsAndGuns","token":"JohnWick123123"}  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────

┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Status: 200  SUCCESS
  Headers
  ┌ Content-Type: "application/json"
  └ Authorization: "[ REDACTED ]"
  Body:
{"firstName":"John","lastName":"Wick","username":"johnwick","password":"iReallyLoveDogsAndGuns","token":"JohnWick123123"}  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`
                },
                'Test that obfuscation wont work on body when body is a non valid json string',
            )
            'Test Axios Logger Obfuscation'({ bodyIsValidJson, bodyAsString, config, expectedLog }) {
                let messages: Array<string> = []
                const loggerMock: LogFn = (
                    msg: string | object,
                    ...args: any[]
                ): void => {
                    const message = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
                    messages = [...messages, message]
                    logger.info(message)
                }
                const log4jsLogger = log4js.getLogger('axios')
                log4jsLogger.info = loggerMock
                const axiosLogger = AxiosLogger.from(log4jsLogger, config)
                const url = 'https://doodle.com'
                const method: Method = 'POST'
                const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer superSecretCode' }
                const body = {
                    'firstName': 'John',
                    'lastName': 'Wick',
                    'username': 'johnwick',
                    'password': 'iReallyLoveDogsAndGuns',
                    'token': 'JohnWick123123',
                }
                let data = bodyAsString ? JSON.stringify(body) : body
                if (!bodyIsValidJson && bodyAsString) {
                    data += '}'
                }
                const axiosRequestConfig: AxiosRequestConfig = {
                    url,
                    method,
                    baseURL: url,
                    headers,
                    data: data,
                }

                const axiosResponse: AxiosResponse = {
                    data,
                    status: 200,
                    statusText: 'SUCCESS',
                    headers,
                    config: axiosRequestConfig,
                    request: axiosRequestConfig,
                }

                axiosLogger.logRequest(axiosRequestConfig)
                axiosLogger.logResponse(axiosResponse)
                expect(messages.join('\n')).to.equal(expectedLog)
            }
        }

        @suite('Axios Logger Obfuscator functions suite')
        class AxiosLoggerObfuscatorFunctionsSuite {
            @params(
                { shouldUseEnv: false, config: {}, expectedKeys: DEFAULT_REDACTABLE_KEYS },
                'Default list of keys should be returned if env variable is not set and config is empty',
            )
            @params(
                { shouldUseEnv: false, config: {redactableKeys: ['username']}, expectedKeys: ['username'] },
                'Configured list of keys should be returned if env variable is not set',
            )
            @params(
                { shouldUseEnv: true, config: {redactableKeys: ['username']}, expectedKeys: ['password'] },
                'Environment set keys should be used over specified config',
            )
            @params(
                { shouldUseEnv: true, config: {}, expectedKeys: ['password'] },
                'Environment set keys should be used over default redactable keys',
            )
            'Test Obfuscator getRedactableKeys'({ shouldUseEnv, config, expectedKeys }) {
                if (shouldUseEnv) {
                    process.env.LOGGER_REDACTABLE_KEYS = 'password'
                }
                expect(getRedactableKeys(config)).to.deep.equal(expectedKeys)
                delete process.env.LOGGER_REDACTABLE_KEYS
            }
        }
    },
)