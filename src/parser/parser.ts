import type { IConfig, ObfuscationConfig } from '../config/axios-logger-config'
import { prepareConfig } from '../config/axios-logger-config'
import type { Headers } from '../formatter/formatter'
import { Formatter } from '../formatter/formatter'
import { obfuscate, obfuscateFormData } from '../obfuscator/obfuscator'
import { Separator } from '../separator/separator'

import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

type ErrorSource = 'Request' | 'Response'

export class Parser {
  private static prepareBodyForFormatting({
    body,
    obfuscationConfig,
  }: {
    body: string | object
    obfuscationConfig?: ObfuscationConfig
  }): string | object {
    if (obfuscationConfig?.obfuscate) {
      switch (typeof body) {
        case 'string':
          try {
            const parsedBody = JSON.parse(body) as Record<string, unknown>
            return obfuscate({
              obj: parsedBody,
              obfuscationConfig,
            })
          } catch (e) {
            if (body.includes('&')) {
              // then it looks like we have a form data body, and we can try to obfuscate it
              try {
                return obfuscateFormData({ input: body, obfuscationConfig })
              } catch (e) {
                // in case we were wrong, we just return the original body
                return body
              }
            }
            return body
          }
        case 'object':
          return obfuscate({
            obj: body as Record<string, unknown>,
            obfuscationConfig,
          })
        default:
          return body
      }
    }
    return body
  }

  private ignoreHeaderKeys: string[] = [
    'get',
    'delete',
    'post',
    'patch',
    'put',
    'head',
    'common',
  ]

  private formatter: Formatter
  private config: IConfig

  public constructor(config: IConfig) {
    this.config = prepareConfig(config)
    this.formatter = new Formatter(this.config)
  }

  public parseError(error: AxiosError, errorSource: ErrorSource): string {
    const startOfRequest = Separator.startingLine(`${errorSource} Error`)
    const code =
      error.code === undefined
        ? ''
        : `${this.formatter.title('Code')}: ${error.code}`
    const message = `${this.formatter.title('Message')}: @${error.message}`
    const stackTrace = `${this.formatter.title('StackTrace')}: @${
      error.stack ?? ''
    }`
    return [
      Separator.newLine(),
      startOfRequest,
      code,
      message,
      stackTrace,
      Separator.endingLine(),
    ]
      .filter((el) => el.length > 0)
      .join('\n')
  }

  public parseUrl(requestConfig: AxiosRequestConfig): string {
    const url: string = requestConfig.url === undefined ? '' : requestConfig.url
    const baseURL = requestConfig.baseURL
    const urlParts: string[] = []
    if (url) {
      if (url.includes('://')) {
        urlParts.push(url)
      }
      if (baseURL && !url.includes('://')) {
        urlParts.push(`${baseURL}/${url}`)
      }
    }
    const requestParams: [string, unknown][] =
      requestConfig.params === undefined
        ? []
        : Object.entries(requestConfig.params as Record<string, unknown>)

    if (requestParams.length > 0) {
      urlParts.push('?')
      for (const [k, v] of requestParams) {
        urlParts.push(`${k}=${encodeURIComponent(String(v))}&`)
      }
    }
    const combinedUrl = urlParts.join('')
    return combinedUrl.charAt(combinedUrl.length - 1) === '&'
      ? combinedUrl.slice(0, -1)
      : combinedUrl
  }

  public parseRequest(request: AxiosRequestConfig): string {
    let requestDetailsArr: unknown[]
    const startOfRequest = Separator.startingLine('Request')
    const url = `${this.formatter.title('URL')}: ${this.parseUrl(request)}`
    const method = `${this.formatter.title('Method')}: @${(
      request.method as string
    ).toUpperCase()}`
    const headersName = `${this.formatter.title('Headers')}:`
    const baseUrl = request.baseURL
    const headers = this._parseHeaders(
      (request.headers as Headers) ?? {},
      baseUrl
    )
    requestDetailsArr = this.config.request?.shouldLogHeaders
      ? [Separator.newLine(), startOfRequest, url, method, headersName, headers]
      : [Separator.newLine(), startOfRequest, url, method]
    if (request.data !== undefined && this.config.request?.shouldLogBody) {
      const contentLength: number | undefined = Parser.getContentLength(
        request.headers as Headers
      )
      const { bodyTitle, body } = this.parseBodyDetails({
        axiosRequestConfig: request,
        obfuscationConfig: this.config.obfuscation,
        maxLogContentLength: this.config.request?.maxLogContentLength,
        contentLength,
      })
      requestDetailsArr = [...requestDetailsArr, bodyTitle, body]
    }
    return [...requestDetailsArr, Separator.endingLine()].join('\n')
  }

  public parseResponse(resp: AxiosResponse): string {
    const startOfRequest = Separator.startingLine('Response')
    const url = `${this.formatter.title('URL')}: ${this.parseUrl(resp.config)}`
    const method = `${this.formatter.title('Method')}: @${(
      resp.config.method as string
    ).toUpperCase()}`
    const status = `${this.formatter.title('Status')}: ${resp.status}  ${
      resp.statusText
    }`
    const headersName = `${this.formatter.title('Headers')}`
    const baseUrl = resp.config.baseURL
    const headers = this._parseHeaders((resp.headers as Headers) ?? {}, baseUrl)
    const responseDetailsArr = this.config.response?.shouldLogHeaders
      ? [
          Separator.newLine(),
          startOfRequest,
          url,
          method,
          status,
          headersName,
          headers,
        ]
      : [Separator.newLine(), startOfRequest, url, method, status]

    const emptyBody = `${this.formatter.indent()}{}`
    if (
      resp.data !== undefined &&
      resp.data !== null &&
      this.config.response?.shouldLogBody
    ) {
      const contentLength: number | undefined = Parser.getContentLength(
        resp.headers as Headers
      )
      const { bodyTitle, body } = this.parseBodyDetails({
        axiosRequestConfig: resp,
        obfuscationConfig: this.config.obfuscation,
        maxLogContentLength: this.config.response?.maxLogContentLength,
        contentLength,
      })
      return [
        ...responseDetailsArr,
        bodyTitle,
        body,
        Separator.endingLine(),
      ].join('\n')
    } else if (this.config.response?.shouldLogBody) {
      const bodyTitle = `${this.formatter.title('Body')}:`
      return [
        ...responseDetailsArr,
        bodyTitle,
        emptyBody,
        Separator.endingLine(),
      ].join('\n')
    } else {
      return [...responseDetailsArr, Separator.endingLine()].join('\n')
    }
  }

  // this method is created in order to enable unit testing of protected @parseHeaders method
  public _setFormatter(formatter: Formatter) {
    this.formatter = formatter
  }

  // this method is created in order to enable unit testing of protected @parseHeaders method
  protected setConfig(config: IConfig) {
    this.config = config
  }

  public _parseHeaders(headers: Headers, baseUrl = ''): string {
    if (headers !== undefined) {
      const commonHeaders = headers.common as Headers
      const mergedHeaders: Headers = { ...headers, ...commonHeaders }
      delete mergedHeaders.common
      const xContentfulRouteHeader: string =
        typeof mergedHeaders['x-contentful-route'] === 'object'
          ? JSON.stringify(mergedHeaders['x-contentful-route'])
          : mergedHeaders['x-contentful-route']
      if (xContentfulRouteHeader !== undefined && baseUrl) {
        // specific for contentful
        mergedHeaders[
          'x-contentful-route'
        ] = `${baseUrl}${xContentfulRouteHeader}`
      }
      const obfuscationConfig = this.config.obfuscation
      if (obfuscationConfig?.obfuscate) {
        const obfuscatedMergedHeaders = obfuscate({
          obj: mergedHeaders,
          obfuscationConfig,
        }) as Headers
        return this.transformHeadersToStringArr(obfuscatedMergedHeaders).join(
          '\n'
        )
      }
      return this.transformHeadersToStringArr(mergedHeaders).join('\n')
    }
    return ''
  }

  protected transformHeadersToStringArr(headers: Headers): string[] {
    const headersString: string[] = []
    Object.keys(headers).forEach((key, index, headersArray) => {
      if (
        Object.prototype.hasOwnProperty.call(headers, key) &&
        this.ignoreHeaderKeys.indexOf(key) === -1
      ) {
        const formattedHeaderEntry = this.formatter.prettyHeaderEntry(
          {
            key,
            value: headers[key],
          },
          index === 0,
          index === headersArray.length - 1
        )
        headersString.push(formattedHeaderEntry)
      }
    })
    return headersString
  }

  private parseBodyDetails({
    axiosRequestConfig,
    obfuscationConfig,
    maxLogContentLength,
    contentLength,
  }: {
    axiosRequestConfig: AxiosRequestConfig
    obfuscationConfig?: ObfuscationConfig
    maxLogContentLength?: number
    contentLength?: number
  }): { bodyTitle: string; body: string } {
    const bodyTitle = `${this.formatter.title('Body')}:`
    const parsedBody = Parser.prepareBodyForFormatting({
      body: axiosRequestConfig.data as string | object,
      obfuscationConfig,
    })
    const prettyFormattedBody = this.formatter.prettyFormatBody({
      body: parsedBody,
      maxLogContentLength,
      contentLength,
    })
    return { bodyTitle, body: prettyFormattedBody }
  }

  private static getContentLength(headers: Headers): number | undefined {
    const foundKey = Object.keys(headers).find(
      (key) => key.toLowerCase() === 'Content-Length'.toLowerCase()
    )
    if (foundKey === undefined) {
      return undefined
    }
    return Number(headers[foundKey])
  }
}
