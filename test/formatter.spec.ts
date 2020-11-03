import { params, suite } from '@testdeck/mocha'
import { expect } from 'chai'
import { Formatter } from '../src/formatter/formatter'
const formatter = new Formatter(Formatter.defaultConfig())
const indent = formatter.indent()
describe('Formatter Test Suite', () => {

    @suite('Test Body Formatter')
    class BodyPrettyFormatterTestSuite extends Formatter {
        @params(
            {
                body: '{"name":"John","lastName":"Wick"}',
                expectedResult: `${indent}{
\t"name": "John",
\t"lastName": "Wick"
${indent}}`,
            },
            'Body object as string',
        )
        @params(
            {
                body: { name: 'John', lastName: 'Wick' },
                expectedResult: `${indent}{
\t"name": "John",
\t"lastName": "Wick"
${indent}}`,
            },
            'Body as string',
        )
        @params(
            {
                body: 'Hello how are you?',
                expectedResult: `${indent}Hello how are you?`,
            },
            'Body object as simple string',
        )
        'Test Pretty Formatting Of Body'({ body, expectedResult }) {
            const formattedBody = formatter.prettyFormatBody(body)
            expect(formattedBody).to.equal(expectedResult)
        }
    }

    @suite('Test Single Header Entry Pretty Formatting')
    class HeaderEntryPrettyFormatterTestSuite extends Formatter {
        @params(
            {
                headerEntry: { key: 'Accept-Content', value: 'application-json' },
                isFirstElement: true,
                isLastElement: false,
                expectedResult: `${indent}┌ Accept-Content: "application-json"`,
            },
            'First header entry',
        )
        @params(
            {
                headerEntry: { key: 'Accept-Content', value: 'application-json' },
                isFirstElement: false,
                isLastElement: false,
                expectedResult: `${indent}├ Accept-Content: "application-json"`,
            },
            'Middle header entry',
        )
        @params(
            {
                headerEntry: { key: 'Accept-Content', value: 'application-json' },
                isFirstElement: false,
                isLastElement: true,
                expectedResult: `${indent}└ Accept-Content: "application-json"`,
            },
            'Last header entry',
        )
        @params(
            {
                headerEntry: { key: 'Accept-Content', value: 'application-json' },
                isFirstElement: true,
                isLastElement: true,
                expectedResult: `${indent}┌\n${indent}├ Accept-Content: "application-json"\n${indent}└`,
            },
            'Single header entry',
        )
        'Test how we print headers entry in a pretty format'({
                                                                 headerEntry,
                                                                 isFirstElement,
                                                                 isLastElement,
                                                                 expectedResult,
                                                             }) {
            expect(
                formatter.prettyHeaderEntry(headerEntry, isFirstElement, isLastElement),
            ).to.eq(expectedResult)
        }
    }

    @suite('Test Indent Function')
    class IndentFunctionUnitTest extends Formatter {
        @params(
            {
                config: { indent: 2, indentChar: ' ' },
                expectedResult: new Array<string>(2).fill(' ').join(''),
            },
            'Two spaces',
        )
        @params(
            {
                config: { indent: 4, indentChar: ' ' },
                expectedResult: new Array<string>(4).fill(' ').join(''),
            },
            'Four spaces',
        )
        @params(
            {
                config: { indent: 2, indentChar: '\t' },
                expectedResult: new Array<string>(2).fill('\t').join(''),
            },
            'Two tabs',
        )
        @params(
            {
                config: { indentChar: '\t' },
                expectedResult: new Array<string>(2).fill('\t').join(''),
            },
            'Indent config param is missing',
        )
        @params(
            {
                config: { indent: 2 },
                expectedResult: new Array<string>(2).fill(' ').join(''),
            },
            'IndentChar param is missing',
        )
        @params(
            {
                config: {},
                expectedResult: new Array<string>(2).fill(' ').join(''),
            },
            'Config is empty',
        )
        @params(
            {
                config: undefined,
                expectedResult: new Array<string>(2).fill(' ').join(''),
            },
            'Config is undefined',
        )
        'Test how indent function works'({
                                             config,
                                             expectedResult,
                                         }) {
            const formatter = new Formatter(config)
            expect(
                formatter.indent(),
            ).to.eq(expectedResult)
        }
    }
})