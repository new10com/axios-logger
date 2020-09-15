import { params, suite } from '@testdeck/mocha'
import { expect } from 'chai'
import { indent } from '../src/constants/constants'
import { Formatter } from '../src/formatter/formatter'

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
            const formattedBody = Formatter.prettyFormatBody(body)
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
                Formatter.prettyHeaderEntry(headerEntry, isFirstElement, isLastElement),
            ).to.eq(expectedResult)
        }
    }
})