import { params, suite } from '@testdeck/mocha'
import { expect } from 'chai'
import { logger } from '../src/logger/logger'
import { Parser } from '../src/parser/parser'
import { Formatter } from '../src/formatter/formatter'
import { defaultConfig } from '../src/config/axios-logger-config'
const formatter = new Formatter(Formatter.defaultConfig())
const indent = formatter.indent()
describe('Parser Test Suite', () => {
    @suite('Test Body Formatter')
    class BodyPrettyFormatterTestSuite extends Parser {
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
        'Test Pretty Formatting Of Body'({ body, expectedResult }) {
            const formattedBody = formatter.prettyFormatBody(body)
            expect(formattedBody).to.equal(expectedResult)
        }
    }

    @suite('Test URL parsing')
    class URLParsingTestSuite extends Parser {
        @params({config: { url: 'https://google.com', baseURL: ''} , expectedUrl: 'https://google.com'}, 'Url should be used if it has "://" and baseUrl is empty')
        @params({config: { url: 'https://google.com', baseURL: 'https://go.com'} , expectedUrl: 'https://google.com'}, 'Url should be used if it has "://" and baseUrl is not empty')
        @params({config: { url: 'entries', baseURL: 'https://google.com'} , expectedUrl: 'https://google.com/entries'}, 'BaseUrl should be used if url doesnt have "://"')
        @params({config: { url: 'google.com', baseURL: ''} , expectedUrl: 'google.com'}, 'Both url and baseUrl are empty')
        @params({config: { url: undefined, baseURL: undefined} , expectedUrl: ''}, 'Both url and baseUrl are undefined')
        'Test URL Parsing'({ config, expectedUrl }) {
            const url = this.parseUrl(config)
            logger.info(`Url: ${url}`)
            expect(url).to.equal(expectedUrl)
        }
    }

    @suite('Test Single Header Entry Pretty Formatting')
    class HeaderEntryPrettyFormatterTestSuite extends Parser {
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
        'Test how we print headers entry in a pretty format'({
                                                                 headerEntry,
                                                                 isFirstElement,
                                                                 isLastElement,
                                                                 expectedResult
                                                             }) {
            expect(
                formatter.prettyHeaderEntry(headerEntry, isFirstElement, isLastElement)
            ).to.eq(expectedResult)
        }
    }

    @suite('Test Multiple Header Entries Pretty Formatting')
    class MultipleHeaderEntriesFormattingTestSuite extends Parser {
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
        'Test headers parsing'({ headers, expectedResult }) {
            this.setFormatter(formatter)
            this.setConfig(defaultConfig())
            const parsedHeader = this.parseHeaders(headers)
            logger.info(`Headers: \n${parsedHeader}`)
            expect(parsedHeader).to.equal(expectedResult)
        }
    }
})
