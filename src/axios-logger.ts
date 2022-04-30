import type { IConfig } from './config/axios-logger-config'
import { defaultConfig } from './config/axios-logger-config'
import { Parser } from './parser/parser'

import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { Logger } from 'log4js'
import { configure, getLogger } from 'log4js'

export interface LogFn {
  (msg: string, ...args: unknown[]): void
  (obj: object | string, msg?: string, ...args: unknown[]): void
}

export class AxiosLogger {
  public static default(config: IConfig = defaultConfig()) {
    configure({
      appenders: {
        axios: { type: 'console', layout: { type: 'colored' }, level: 'debug' },
      },
      categories: { default: { appenders: ['axios'], level: 'debug' } },
    })
    const log4jsLogger = getLogger('axios')
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

  public constructor(
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

  public logErrorDetails(err: unknown): unknown {
    if (err !== undefined) {
      const possibleError: AxiosError = err as AxiosError
      const parsedError = this.parser.parseError(err as AxiosError, 'Response')
      const parsedRequest: string =
        possibleError.config !== undefined
          ? this.parser.parseRequest(possibleError.config)
          : ''
      const parsedResponse =
        possibleError.response !== undefined
          ? this.parser.parseResponse(possibleError.response)
          : ''
      this.logError(
        [parsedRequest, parsedResponse, parsedError]
          .filter((el) => el.length > 0)
          .join('\n')
      )
      return err
    }
    return err
  }
}
