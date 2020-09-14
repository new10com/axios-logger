import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import log4js, { Logger } from 'log4js'
import { LogFn } from 'pino'

interface Headers {
  [key: string]: string | object
}

interface HeaderRecord {
  key: string
  value: string | object
}

export const indent = '  '

type ErrorSource = 'Request' | 'Response'

export class AxiosLogger {

  public static default() {
    log4js.configure({
      appenders: {
        axios: { type: 'console', layout: { type: 'colored' }, level: 'debug' }
      },
      categories: { default: { appenders: ['axios'], level: 'debug' } }
    })
    const log4jsLogger = log4js.getLogger('axios')
    return new AxiosLogger(
      log4jsLogger.info.bind(log4jsLogger),
      log4jsLogger.error.bind(log4jsLogger)
    )
  }

  public static from(logger: Logger): AxiosLogger {
    return new AxiosLogger(logger.info.bind(logger), logger.error.bind(logger))
  }

  public static using(infoFn: LogFn, errorFn: LogFn) {
    return new AxiosLogger(infoFn.bind(infoFn), errorFn.bind(errorFn))
  }
  protected ignoreHeaderKeys: string[] = [
    'get',
    'delete',
    'post',
    'patch',
    'put',
    'head',
    'common'
  ]

  protected logInfo: LogFn
  protected logError: LogFn

  constructor(infoFn: LogFn, errorFn: LogFn) {
    this.logInfo = infoFn
    this.logError = errorFn
  }

  public logRequest(request: AxiosRequestConfig): void {
    this.logInfo(this.parseRequest(request))
  }

  public logResponse(resp: AxiosResponse): void {
    this.logInfo(this.parseResponse(resp))
  }

  public logErrorDetails(err: any): void {
    const possibleError = err as AxiosError
    const parsedError = this.parseError(err as AxiosError, 'Response')
    const parsedRequest = possibleError.config
      ? this.parseRequest(possibleError.config)
      : ''
    const parsedResponse = possibleError.response
      ? this.parseResponse(possibleError.response)
      : ''
    this.logError(
      [parsedRequest, parsedResponse, parsedError]
        .filter(el => el.length > 0)
        .join('\n')
    )
  }

  protected parseError(error: AxiosError, errorSource: ErrorSource): string {
    const startOfRequest = this.startingLine(`${errorSource} Error`)
    const code =
      error.code === undefined ? '' : `${this.title('Code')}: ${error.code}`
    const message = `${this.title('Message')}: @${error.message}`
    const stackTrace = `${this.title('StackTrace')}: @${error.stack}`
    return [
      this.newLine(),
      startOfRequest,
      code,
      message,
      stackTrace,
      this.endingLine()
    ]
      .filter(el => el.length > 0)
      .join('\n')
  }

  protected parseRequest(request: AxiosRequestConfig): string {
    let requestDetailsArr
    const startOfRequest = this.startingLine('Request')
    const url = `${this.title('URL')}: ${request.url}`
    const method = `${this.title(
      'Method'
    )}: @${(request.method as string).toUpperCase()}`
    const headersName = `${this.title('Headers')}:`
    const headers = this.parseHeaders(request.headers)
    requestDetailsArr = [
      this.newLine(),
      startOfRequest,
      url,
      method,
      headersName,
      headers
    ]
    if (request.data) {
      const bodyTitle = `${this.title('Body')}:`
      const body = this.prettyFormatBody(request.data)
      requestDetailsArr = [...requestDetailsArr, bodyTitle, body]
    }
    return [...requestDetailsArr, this.endingLine()].join('\n')
  }

  protected parseResponse(resp: AxiosResponse): string {
    let responseDetailsArr
    const startOfRequest = this.startingLine('Response')
    const url = `${this.title('URL')}: ${resp.config.url}`
    const method = `${this.title('Method')}: @${(resp.config
      .method as string).toUpperCase()}`
    const status = `${this.title('Status')}: ${resp.status} \ ${
      resp.statusText
    }`
    const headersName = `${this.title('Headers')}`
    const headers = this.parseHeaders(resp.headers)
    responseDetailsArr = [
      this.newLine(),
      startOfRequest,
      url,
      method,
      status,
      headersName,
      headers,
      `${this.title('Body')}:`
    ]
    let body = `${indent}{}`
    if (resp.data) {
      body = this.prettyFormatBody(resp.data)
    }
    return [...responseDetailsArr, body, this.endingLine()].join('\n')
  }

  protected startingLine(name): string {
    return `┌────── ${name} ──────────────────────────────────────────────────────────────────────────────────────────────`
  }

  protected endingLine(): string {
    return `└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`
  }

  protected title(detailName: string): string {
    return `  ${detailName}`
  }

  protected newLine(): string {
    return ''
  }

  protected prettyFormatBody(body: string | object): string {
    let bodyAsString = ''
    switch (typeof body) {
      case 'string':
        if (body.charAt(0) === '{') {
          bodyAsString = indent + JSON.stringify(JSON.parse(body), null, '\t')
        } else {
          bodyAsString = indent + body
        }
        break
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

  protected parseHeaders(headers: Headers): string {
    if (headers) {
      const commonHeaders = headers.common as Headers
      const mergedHeaders: Headers = { ...headers, ...commonHeaders }
      delete mergedHeaders.common
      return this.transformHeadersToStringArr(mergedHeaders).join('\n')
    }
    return ''
  }

  protected transformHeadersToStringArr(headers: Headers): string[] {
    const headersString: string[] = []
    Object.keys(headers).forEach((key, index, headersArray) => {
      if (
        headers.hasOwnProperty(key) &&
        this.ignoreHeaderKeys.indexOf(key) === -1
      ) {
        const formattedHeaderEntry = this.prettyHeaderEntry(
          {
            key,
            value: headers[key]
          },
          index === 0,
          index === headersArray.length - 1
        )
        headersString.push(formattedHeaderEntry)
      }
    })
    return headersString
  }

  protected prettyHeaderEntry(
    headerEntry: HeaderRecord,
    isFirstElement: boolean,
    isLastElement: boolean
  ): string {
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
