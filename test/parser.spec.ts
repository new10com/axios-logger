import { Formatter } from '../src/formatter/formatter'
import { Parser } from '../src/parser/parser'
import { defaultConfig } from '../src/config/axios-logger-config'

const formatter = new Formatter(Formatter.defaultConfig())
const indent = formatter.indent()

describe(`Parser Test Suite`, () => {
  describe(`Test Body Formatter`, () => {
    it.each([
      [
        'Body object as string',
        '{"name":"John","lastName":"Wick"}',
        `${indent}{
\t"name": "John",
\t"lastName": "Wick"
${indent}}`,
      ],
      [
        `Body object as simple string`,
        'Hello how are you?',
        `${indent}Hello how are you?`,
      ],
    ])(`%s`, (title, body, expected) => {
      expect(formatter.prettyFormatBody(body)).toEqual(expected)
    })
  })

  describe(`Test URL parsing`, () => {
    it.each([
      [
        'Url should be used if it has "://" and baseUrl is empty',
        { url: 'https://google.com', baseURL: '' },
        'https://google.com',
      ],
      [
        'Url should be used if it has "://" and baseUrl is not empty',
        { url: 'https://google.com', baseURL: 'https://go.com' },
        'https://google.com',
      ],
      [
        'BaseUrl should be used if url doesnt have "://"',
        { url: 'entries', baseURL: 'https://google.com' },
        'https://google.com/entries',
      ],
      [
        'Both url and baseUrl are empty',
        { url: 'google.com', baseURL: '' },
        'google.com',
      ],
      [
        'Both url and baseUrl are undefined',
        { url: undefined, baseURL: undefined },
        '',
      ],
    ])(`%s`, (title, config, expectedUrl) => {
      const parser = new Parser(defaultConfig())
      const url = parser.parseUrl(config)
      expect(url).toEqual(expectedUrl)
    })
  })

  describe('Test Single Header Entry Pretty Formatting', () => {
    it.each([
      [
        'First header entry',
        { key: 'Accept-Content', value: 'application-json' },
        true,
        false,
        `${indent}┌ Accept-Content: "application-json"`,
      ],
      [
        'Middle header entry',
        { key: 'Accept-Content', value: 'application-json' },
        false,
        false,
        `${indent}├ Accept-Content: "application-json"`,
      ],
      [
        'Last header entry',
        { key: 'Accept-Content', value: 'application-json' },
        false,
        true,
        `${indent}└ Accept-Content: "application-json"`,
      ],
      [
        'Single header entry',
        { key: 'Accept-Content', value: 'application-json' },
        true,
        true,
        `${indent}┌\n${indent}├ Accept-Content: "application-json"\n${indent}└`,
      ],
    ])(`%s`, (title, header, isFirstElement, isLastElement, expected) => {
      expect(
        formatter.prettyHeaderEntry(header, isFirstElement, isLastElement)
      ).toEqual(expected)
    })
  })

  describe(`Test Multiple Header Entries Pretty Formatting`, () => {
    it.each([
      [
        'Simple accept-content header',
        { 'Accept-Content': 'application/json' },
        `${indent}┌\n${indent}├ Accept-Content: "application/json"\n${indent}└`,
      ],
      [
        'Two records',
        {
          Accept: 'application/json',
          'Content-Type': 'application-json',
        },
        `${indent}┌ Accept: "application/json"\n${indent}└ Content-Type: "application-json"`,
      ],
      [
        'Three records',
        {
          Accept: 'application/json',
          'User-Agent': 'new10-integration-tests/v1',
          'Content-Type': 'application-json',
        },
        `${indent}┌ Accept: "application/json"\n${indent}├ User-Agent: "new10-integration-tests/v1"\n${indent}└ Content-Type: "application-json"`,
      ],
      [
        'Four records with long authorization header',
        {
          Accept: 'application/json',
          Authorization:
            'Bearer eyJraWQiOiI0WFpyUTlXZUlnZEVBR1d3eFFTYWFvTmFrVGtHZmpEU1VqbU0rTnVoeWkwPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3ZmhwbjFxN2hkcmt0bmNmNWhyZXVkM25rZSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiaHR0cHM6XC9cL2F1dGguZGV2Lm5ldzEwLmlvXC9kZWZhdWx0IiwiYXV0aF90aW1lIjoxNTk5NTc0NjgxLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9XdnJ0NnJod3oiLCJleHAiOjE1OTk1NzgyODEsImlhdCI6MTU5OTU3NDY4MSwidmVyc2lvbiI6MiwianRpIjoiM2MwMjQ3YjEtYjFhMy00ZTkxLTk4NWQtMGI4NTdlODI1ODg5IiwiY2xpZW50X2lkIjoiN2ZocG4xcTdoZHJrdG5jZjVocmV1ZDNua2UifQ.N673oUZdpbt_5qMa44VQGGwlBuhzPVoKqwE7aHzOlPc021f4pnXFEA4HGqOmk3-W5_gopwJJV0RaVaB3Xq_Zp49xEDC1dTllSGXCgK-Ywa-isqyREYPmC8vq9uatGtlNKx_uOC5GK9LEh72wzB6uuQ4DKL-Y8U7OG1onppSEKKS-jSeVHa1WdJ-BhAiqv1t2VofhI72S_Wko8kjGeXKfA3HLUGjem2lKeTV59Fl3t8d70XcB30ODXB-YVUL3L95GqLcTxRDwY5ANHGbfhEPBXUpPgmiq-THSPL0eyxqs0-MjzD_kzvzRDEEy4K3JKlhtcQeguuQuKZZTg',
          'User-Agent': 'new10-integration-tests/v1',
          'Content-Type': 'application-json',
        },
        `${indent}┌ Accept: "application/json"\n${indent}├ Authorization: "Bearer eyJraWQiOiI0WFpyUTlXZUlnZEVBR1d3eFFTYWFvTmFrVGtHZmpEU1VqbU0rTnVoeWkwPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3ZmhwbjFxN2hkcmt0bmNmNWhyZXVkM25rZSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiaHR0cHM6XC9cL2F1dGguZGV2Lm5ldzEwLmlvXC9kZWZhdWx0IiwiYXV0aF90aW1lIjoxNTk5NTc0NjgxLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9XdnJ0NnJod3oiLCJleHAiOjE1OTk1NzgyODEsImlhdCI6MTU5OTU3NDY4MSwidmVyc2lvbiI6MiwianRpIjoiM2MwMjQ3YjEtYjFhMy00ZTkxLTk4NWQtMGI4NTdlODI1ODg5IiwiY2xpZW50X2lkIjoiN2ZocG4xcTdoZHJrdG5jZjVocmV1ZDNua2UifQ.N673oUZdpbt_5qMa44VQGGwlBuhzPVoKqwE7aHzOlPc021f4pnXFEA4HGqOmk3-W5_gopwJJV0RaVaB3Xq_Zp49xEDC1dTllSGXCgK-Ywa-isqyREYPmC8vq9uatGtlNKx_uOC5GK9LEh72wzB6uuQ4DKL-Y8U7OG1onppSEKKS-jSeVHa1WdJ-BhAiqv1t2VofhI72S_Wko8kjGeXKfA3HLUGjem2lKeTV59Fl3t8d70XcB30ODXB-YVUL3L95GqLcTxRDwY5ANHGbfhEPBXUpPgmiq-THSPL0eyxqs0-MjzD_kzvzRDEEy4K3JKlhtcQeguuQuKZZTg"\n${indent}├ User-Agent: "new10-integration-tests/v1"\n${indent}└ Content-Type: "application-json"`,
      ],
      [
        'Headers with common headers values',
        {
          'Accept-Content': 'application/json',
          common: { Authorization: 'Bla test', RequestTraceId: 'Bla-123-123' },
        },
        `${indent}┌ Accept-Content: "application/json"
  ├ Authorization: "Bla test"
  └ RequestTraceId: "Bla-123-123"`,
      ],
    ])(`%s`, (title, headers, expected) => {
      const parser = new Parser(defaultConfig())

      parser._setFormatter(formatter)
      const parsedHeader = parser._parseHeaders(headers)
      expect(parsedHeader).toEqual(expected)
    })
  })
})
