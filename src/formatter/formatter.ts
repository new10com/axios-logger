import { DEFAULT_INDENT, DEFAULT_INDENT_CHAR } from '../constants/constants'

export interface Headers {
  [key: string]: string | object
}

export interface HeaderRecord {
  key: string
  value: string | object
}

export interface FormatterConfig {
  indent?: number
  indentChar?: string
}

export class Formatter {
  public static defaultConfig(): FormatterConfig {
    return { indent: DEFAULT_INDENT, indentChar: DEFAULT_INDENT_CHAR }
  }

  private readonly config: FormatterConfig

  constructor(config: FormatterConfig) {
    this.config = config
  }

  public title(detailName: string): string {
    return `  ${detailName}`
  }

  public prettyFormatBody(body: string | object): string {
    let bodyAsString = ''
    const indent = this.indent()
    switch (typeof body) {
      case 'string':
        try {
          if (body.charAt(0) === '{') {
            bodyAsString = indent + JSON.stringify(JSON.parse(body), null, '\t')
          } else {
            bodyAsString = indent + body
          }
          break
        } catch (e) {
          bodyAsString = body
          break
        }
      case 'object':
        bodyAsString = indent + JSON.stringify(body, null, '\t')
        break
    }
    const lastCurlyBracket = bodyAsString.lastIndexOf('}')

    return lastCurlyBracket > 0
      ? bodyAsString.substr(0, lastCurlyBracket) +
          `${indent}` +
          bodyAsString.substr(lastCurlyBracket)
      : bodyAsString
  }

  public indent(): string {
    if (this.config) {
      const indent = this.config.indent ? this.config.indent : DEFAULT_INDENT
      const indentChar = this.config.indentChar
        ? this.config.indentChar
        : DEFAULT_INDENT_CHAR
      return new Array<string>(indent).fill(indentChar).join('')
    }
    return new Array<string>(DEFAULT_INDENT).fill(DEFAULT_INDENT_CHAR).join('')
  }

  public prettyHeaderEntry(
    headerEntry: HeaderRecord,
    isFirstElement: boolean,
    isLastElement: boolean
  ): string {
    const indent = this.indent()
    const startingBracket = '┌'
    const middleBracket = '├'
    const endingBracket = '└'
    const headerString = `${headerEntry.key}: "${headerEntry.value}"`
    if (isFirstElement && isLastElement) {
      return [
        `${indent}${startingBracket}`,
        `${indent}${middleBracket} ${headerString}`,
        `${indent}${endingBracket}`
      ].join('\n')
    }
    if (isFirstElement) {
      return `${indent}${startingBracket} ${headerString}`
    }
    if (isLastElement) {
      return `${indent}${endingBracket} ${headerString}`
    }
    return `${indent}${middleBracket} ${headerString}`
  }
}
