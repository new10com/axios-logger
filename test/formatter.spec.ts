import { Formatter } from '../src/formatter/formatter'

const formatter = new Formatter(Formatter.defaultConfig())
const indent = formatter.indent()
describe('Formatter Test Suite', () => {
  describe(`Test Body Formatter`, () => {
    it.each([
      [
        `Body object as string`,
        `{"name":"John","lastName":"Wick"}`,
        `${indent}{
\t"name": "John",
\t"lastName": "Wick"
${indent}}`,
      ],
      [
        'Body as string',
        { name: 'John', lastName: 'Wick' },
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

  describe(`Test Single Header Entry Pretty Formatting`, () => {
    it.each([
      [
        `First header entry`,
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
    ])(`%s`, (title, header, isFirst, isLast, expected) => {
      expect(formatter.prettyHeaderEntry(header, isFirst, isLast)).toEqual(
        expected
      )
    })
  })

  describe(`Test Indent Function`, () => {
    it.each([
      [
        `Two spaces`,
        { indent: 2, indentChar: ' ' },
        new Array<string>(2).fill(' ').join(''),
        `Four spaces`,
        { indent: 2, indentChar: ' ' },
        new Array<string>(4).fill(' ').join(''),
        `Two tabs`,
        { indent: 2, indentChar: '\t' },
        new Array<string>(2).fill('\t').join(''),
        `Indent config param is missing`,
        { indentChar: '\t' },
        new Array<string>(2).fill('\t').join(''),
        `IndentChar param is missing`,
        { indent: 2 },
        new Array<string>(2).fill(' ').join(''),
        `Config is empty`,
        {},
        new Array<string>(2).fill(' ').join(''),
        `Config is undefined`,
        undefined,
        new Array<string>(2).fill(' ').join(''),
      ],
    ])(`%s`, (title, config, expected) => {
      const formatter = new Formatter(config)
      expect(formatter.indent()).toEqual(expected)
    })
  })
})
