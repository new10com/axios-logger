import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import log4js, { Logger } from 'log4js'
import { defaultConfig, IConfig } from './config/axios-logger-config'
import { Parser } from './parser/parser'

export interface LogFn {
  (msg: string, ...args: any[]): void
  (obj: object, msg?: string, ...args: any[]): void
}

export class AxiosLogger {
  public static default(config: IConfig = defaultConfig()) {
    log4js.configure({
      appenders: {
        axios: { type: 'console', layout: { type: 'colored' }, level: 'debug' }
      },
      categories: { default: { appenders: ['axios'], level: 'debug' } }
    })
    const log4jsLogger = log4js.getLogger('axios')
    return new AxiosLogger(
      log4jsLogger.info.bind(log4jsLogger),
      log4jsLogger.error.bind(log4jsLogger),
      config
    )
  }

  public static from(
    logger: Logger,
    config: IConfig = defaultConfig()
  ): AxiosLogger {
    return new AxiosLogger(
      logger.info.bind(logger),
      logger.error.bind(logger),
      config
    )
  }

  public static using(
    infoFn: LogFn,
    errorFn: LogFn,
    config: IConfig = defaultConfig()
  ) {
    return new AxiosLogger(infoFn.bind(infoFn), errorFn.bind(errorFn), config)
  }

  protected logInfo: LogFn
  protected logError: LogFn
  private parser: Parser
  private readonly config: IConfig

  constructor(
    infoFn: LogFn,
    errorFn: LogFn,
    config: IConfig = defaultConfig()
  ) {
    this.logInfo = infoFn
    this.logError = errorFn
    this.config = config
    this.parser = new Parser(this.config)
  }

  public logRequest(request: AxiosRequestConfig): AxiosRequestConfig {
    this.logInfo(this.parser.parseRequest(request))
    return request
  }

  public logResponse(resp: AxiosResponse): AxiosResponse {
    this.logInfo(this.parser.parseResponse(resp))
    return resp
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
