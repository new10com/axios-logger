import {
  defaultConfig,
  IConfig,
  prepareConfig,
} from '../src/config/axios-logger-config'
import { DEFAULT_REDACTABLE_KEYS } from '../src/constants/constants'

describe(`Test Axios Logger Configuration Setup`, () => {
  it.each([
    [`Empty config`, {}, defaultConfig()],
    [
      `Different indent`,
      { indent: 4 },
      { ...defaultConfig(), ...{ indent: 4 } },
    ],
    [
      `Different indent and indent char`,
      { indent: 4, indentChar: '\t' },
      { ...defaultConfig(), ...{ indent: 4, indentChar: '\t' } },
    ],
    [
      `Obfuscation is enabled without specifying obfuscation keys`,
      { obfuscation: { obfuscate: true } },
      {
        indent: 2,
        indentChar: ' ',
        obfuscation: {
          obfuscate: true,
          redactableKeys: DEFAULT_REDACTABLE_KEYS,
        },
        request: {
          shouldLogBody: true,
          shouldLogHeaders: true,
        },
        response: {
          shouldLogBody: true,
          shouldLogHeaders: true,
        },
      },
    ],
    [
      `Should not log request body`,
      { request: { shouldLogBody: false } },
      {
        indent: 2,
        indentChar: ' ',
        obfuscation: {
          obfuscate: false,
          redactableKeys: DEFAULT_REDACTABLE_KEYS,
        },
        request: {
          shouldLogBody: false,
          shouldLogHeaders: true,
        },
        response: {
          shouldLogBody: true,
          shouldLogHeaders: true,
        },
      },
    ],
    [
      `Should not log request headers`,
      { request: { shouldLogHeaders: false } },
      {
        indent: 2,
        indentChar: ' ',
        obfuscation: {
          obfuscate: false,
          redactableKeys: DEFAULT_REDACTABLE_KEYS,
        },
        request: {
          shouldLogBody: true,
          shouldLogHeaders: false,
        },
        response: {
          shouldLogBody: true,
          shouldLogHeaders: true,
        },
      },
    ],
    [
      `Should not log response body`,
      { response: { shouldLogBody: false } },
      {
        indent: 2,
        indentChar: ' ',
        obfuscation: {
          obfuscate: false,
          redactableKeys: DEFAULT_REDACTABLE_KEYS,
        },
        request: {
          shouldLogBody: true,
          shouldLogHeaders: true,
        },
        response: {
          shouldLogBody: false,
          shouldLogHeaders: true,
        },
      },
    ],
    [
      `Should not log response headers`,
      { response: { shouldLogHeaders: false } },
      {
        indent: 2,
        indentChar: ' ',
        obfuscation: {
          obfuscate: false,
          redactableKeys: DEFAULT_REDACTABLE_KEYS,
        },
        request: {
          shouldLogBody: true,
          shouldLogHeaders: true,
        },
        response: {
          shouldLogBody: true,
          shouldLogHeaders: false,
        },
      },
    ],
  ])(`%s`, (title, config, expected) => {
    const resultingConfig = prepareConfig(config as IConfig)
    expect(resultingConfig).toEqual(expected)
  })
})
