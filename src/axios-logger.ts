import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import log4js, { Logger } from 'log4js'
import { Parser } from './parser/parser'

interface LogFn {
  (msg: string, ...args: any[]): void;
  (obj: object, msg?: string, ...args: any[]): void;
}

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

  protected logInfo: LogFn
  protected logError: LogFn
  private parser: Parser

  constructor(infoFn: LogFn, errorFn: LogFn) {
    this.logInfo = infoFn
    this.logError = errorFn
    this.parser = new Parser()
  }

  public logRequest(request: AxiosRequestConfig): void {
    this.logInfo(this.parser.parseRequest(request))
  }

  public logResponse(resp: AxiosResponse): void {
    this.logInfo(this.parser.parseResponse(resp))
  }

  public logErrorDetails(err: any): void {
    const possibleError = err as AxiosError
    const parsedError = this.parser.parseError(err as AxiosError, 'Response')
    const parsedRequest = possibleError.config
        ? this.parser.parseRequest(possibleError.config)
        : ''
    const parsedResponse = possibleError.response
        ? this.parser.parseResponse(possibleError.response)
        : ''
    this.logError(
        [parsedRequest, parsedResponse, parsedError]
            .filter(el => el.length > 0)
            .join('\n')
    )
  }
}
