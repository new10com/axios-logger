import { getRedactableKeys } from './obfuscator'

import { AxiosLogger, LogFn } from '../axios-logger'
import { logger } from '../logger/logger'
import { defaultConfig } from '../config/axios-logger-config'
import { DEFAULT_REDACTABLE_KEYS } from '../constants/constants'

import { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { configure, getLogger } from 'log4js'

describe(`Axios Logger Obfuscation Test Suite`, () => {
  configure({
    appenders: {
      axios: { type: 'console', layout: { type: 'colored' }, level: 'debug' },
    },
    categories: { default: { appenders: ['axios'], level: 'debug' } },
  })
  describe(`Axios Logger Obfuscation Test Suite`, () => {
    it.each([
      [
        'Test that obfuscation fields can be configured: bodyIsValidJson: %s bodyAsString: %s defaultConfig',
        true,
        false,
        defaultConfig(),
        `
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
      ],
      [
        'Test that obfuscation fields can be configured: bodyIsValidJson: %s bodyAsString: %s defaultConfig',
        true,
        false,
        { obfuscation: { obfuscate: true } },
        `
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
      ],
      [
        'Test that obfuscation fields can be configured',
        true,
        false,
        {
          obfuscation: {
            obfuscate: true,
            redactableKeys: ['Authorization', 'username', 'password'],
          },
        },
        `
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
      ],
      [
        'Test that obfuscation works when body is a string',
        true,
        true,
        {
          obfuscation: {
            obfuscate: true,
            redactableKeys: ['Authorization', 'username', 'password'],
          },
        },
        `
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
      ],

      [
        'Test that obfuscation wont work on body when body is a non valid json string',
        false,
        true,
        {
          obfuscation: {
            obfuscate: true,
            redactableKeys: ['Authorization', 'username', 'password'],
          },
        },
        `
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
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`,
      ],
      [
        'Test that you can provide a custom replace value in the config',
        true,
        false,
        {
          obfuscation: {
            obfuscate: true,
            redactableKeys: ['Authorization', 'username', 'password'],
            replaceVal: 'CUSTOM_REDACT_VALUE',
          },
        },
        `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Headers:
  ┌ Content-Type: "application/json"
  └ Authorization: "CUSTOM_REDACT_VALUE"
  Body:
  {
\t"firstName": "John",
\t"lastName": "Wick",
\t"username": "CUSTOM_REDACT_VALUE",
\t"password": "CUSTOM_REDACT_VALUE",
\t"token": "JohnWick123123"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────

┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Status: 200  SUCCESS
  Headers
  ┌ Content-Type: "application/json"
  └ Authorization: "CUSTOM_REDACT_VALUE"
  Body:
  {
\t"firstName": "John",
\t"lastName": "Wick",
\t"username": "CUSTOM_REDACT_VALUE",
\t"password": "CUSTOM_REDACT_VALUE",
\t"token": "JohnWick123123"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`,
      ],
      [
        'Test that you can provide a custom replace function in the config',
        true,
        false,
        {
          obfuscation: {
            obfuscate: true,
            redactableKeys: ['Authorization', 'username', 'password'],
            replaceVal: (value: any, key: string) => {
              if (DEFAULT_REDACTABLE_KEYS.includes(key)) {
                return 'VALUE_FROM_FUNCTION'
              }
              return value
            },
          },
        },
        `
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Headers:
  ┌ Content-Type: "application/json"
  └ Authorization: "VALUE_FROM_FUNCTION"
  Body:
  {
\t"firstName": "John",
\t"lastName": "Wick",
\t"username": "johnwick",
\t"password": "VALUE_FROM_FUNCTION",
\t"token": "JohnWick123123"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────

┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com
  Method: @POST
  Status: 200  SUCCESS
  Headers
  ┌ Content-Type: "application/json"
  └ Authorization: "VALUE_FROM_FUNCTION"
  Body:
  {
\t"firstName": "John",
\t"lastName": "Wick",
\t"username": "johnwick",
\t"password": "VALUE_FROM_FUNCTION",
\t"token": "JohnWick123123"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`,
      ],
    ])(`%s`, (title, bodyIsValidJson, bodyAsString, config, expected) => {
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
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer superSecretCode',
      }
      const body = {
        firstName: 'John',
        lastName: 'Wick',
        username: 'johnwick',
        password: 'iReallyLoveDogsAndGuns',
        token: 'JohnWick123123',
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
      expect(messages.join('\n')).toEqual(expected)
    })
  })

  describe(`Axios Logger Obfuscator functions suite`, () => {
    it.each([
      [
        `Default list of keys should be returned if env variable is not set and config is empty`,
        false,
        {},
        DEFAULT_REDACTABLE_KEYS,
      ],
      [
        `Configured list of keys should be returned if env variable is not set`,
        false,
        { redactableKeys: ['username'] },
        ['username'],
      ],
      [
        `Environment set keys should be used over specified config`,
        true,
        { redactableKeys: ['username'] },
        ['password'],
      ],
      [
        `Environment set keys should be used over default redactable keys`,
        true,
        {},
        ['password'],
      ],
    ])(`%s`, (title, shouldUseEnv, config, expectedKeys) => {
      if (shouldUseEnv) {
        process.env.LOGGER_REDACTABLE_KEYS = 'password'
      }
      expect(getRedactableKeys(config)).toEqual(expectedKeys)
      delete process.env.LOGGER_REDACTABLE_KEYS
    })
  })
})
