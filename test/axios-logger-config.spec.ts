import { params, suite } from '@testdeck/mocha'
import { expect } from 'chai'
import { defaultConfig, prepareConfig } from '../src/config/axiios-logger-config'
import { AxiosLogger } from '../src/axios-logger'
import { DEFAULT_REDACTABLE_KEYS } from '../src/constants/constants'

@suite('Test Axios Logger Configuration Setup')
class AxiosLoggerConfig extends AxiosLogger {
    @params(
        {
            config: {},
            expectedResult: defaultConfig(),
        },
        'Empty config',
    )
    @params(
        {
            config: { indent: 4 },
            expectedResult: { ...defaultConfig(), ...{ indent: 4 } },
        },
        'Different indent',
    )
    @params(
        {
            config: { indent: 4, indentChar: '\t' },
            expectedResult: { ...defaultConfig(), ...{ indent: 4, indentChar: '\t' } },
        },
        'Different indent and indent char',
    )
    @params(
        {
            config: { obfuscation: { obfuscate: true } },
            expectedResult: {
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
        },
        'Obfuscation is enabled without specifying obfuscation keys',
    )
    @params(
        {
            config: { request: { shouldLogBody: false } },
            expectedResult: {
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
        },
        'Should not log request body',
    )
    @params(
        {
            config: { request: { shouldLogHeaders: false } },
            expectedResult: {
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
        },
        'Should not log request headers',
    )
    @params(
        {
            config: { response: { shouldLogBody: false } },
            expectedResult: {
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
        },
        'Should not log response body',
    )
    @params(
        {
            config: { response: { shouldLogHeaders: false } },
            expectedResult: {
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
        },
        'Should not log response headers',
    )
    'Test Modification of Configuration'({ config, expectedResult }) {
        const resultingConfig = prepareConfig(config)
        expect(resultingConfig).to.deep.equal(expectedResult)
    }
}