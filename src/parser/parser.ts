import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { IConfig } from '../config/axiios-logger-config'
import { Formatter, Headers } from '../formatter/formatter'
import { Separator } from '../separator/separator'

type ErrorSource = 'Request' | 'Response'

export class Parser {

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

    constructor(config: IConfig) {
        this.formatter = new Formatter(config)
        this.config = config
    }

    public parseError(error: AxiosError, errorSource: ErrorSource): string {
        const startOfRequest = Separator.startingLine(`${errorSource} Error`)
        const code =
            error.code === undefined ? '' : `${this.formatter.title('Code')}: ${error.code}`
        const message = `${this.formatter.title('Message')}: @${error.message}`
        const stackTrace = `${this.formatter.title('StackTrace')}: @${error.stack}`
        return [
            Separator.newLine(),
            startOfRequest,
            code,
            message,
            stackTrace,
            Separator.endingLine(),
        ]
            .filter(el => el.length > 0)
            .join('\n')
    }

    public parseUrl(requestConfig: AxiosRequestConfig): string {
        const url = requestConfig.url === undefined ? '' : requestConfig.url
        const baseURL = requestConfig.baseURL
        if (url) {
            if (url.includes('://')) {
                return url
            }
            if (baseURL && !url.includes('://')) {
                return `${baseURL}/${url}`
            }
        }
        return url
    }

    public parseRequest(request: AxiosRequestConfig): string {
        let requestDetailsArr
        const startOfRequest = Separator.startingLine('Request')
        const url = `${this.formatter.title('URL')}: ${this.parseUrl(request)}`
        const method = `${this.formatter.title(
            'Method',
        )}: @${(request.method as string).toUpperCase()}`
        const headersName = `${this.formatter.title('Headers')}:`
        const baseUrl = request.baseURL
        const headers = this.parseHeaders(request.headers, baseUrl)
        requestDetailsArr = this.config.request.shouldLogHeaders ? [
            Separator.newLine(),
            startOfRequest,
            url,
            method,
            headersName,
            headers,
        ] : [
            Separator.newLine(),
            startOfRequest,
            url,
            method,
        ]
        if (request.data && this.config.request.shouldLogBody) {
            const bodyTitle = `${this.formatter.title('Body')}:`
            const body = this.formatter.prettyFormatBody(request.data)
            requestDetailsArr = [...requestDetailsArr, bodyTitle, body]
        }
        return [...requestDetailsArr, Separator.endingLine()].join('\n')
    }

    public parseResponse(resp: AxiosResponse): string {
        let responseDetailsArr
        const startOfRequest = Separator.startingLine('Response')
        const url = `${this.formatter.title('URL')}: ${this.parseUrl(resp.config)}`
        const method = `${this.formatter.title('Method')}: @${(resp.config
            .method as string).toUpperCase()}`
        const status = `${this.formatter.title('Status')}: ${resp.status} \ ${
            resp.statusText
        }`
        const headersName = `${this.formatter.title('Headers')}`
        const baseUrl = resp.config.baseURL
        const headers = this.parseHeaders(resp.headers, baseUrl)
        responseDetailsArr = this.config.response.shouldLogHeaders ? [
            Separator.newLine(),
            startOfRequest,
            url,
            method,
            status,
            headersName,
            headers,
        ]: [
            Separator.newLine(),
            startOfRequest,
            url,
            method,
            status,
        ]

        const emptyBody = `${this.formatter.indent()}{}`
        if (resp.data && this.config.response.shouldLogBody) {
            const body = this.formatter.prettyFormatBody(resp.data)
            return [...responseDetailsArr,`${this.formatter.title('Body')}:`, body, Separator.endingLine()].join('\n')
        } else if (this.config.response.shouldLogBody) {
            return [...responseDetailsArr,`${this.formatter.title('Body')}:`, emptyBody, Separator.endingLine()].join('\n')
        } else {
            return [...responseDetailsArr, Separator.endingLine()].join('\n')
        }

    }

    // this method is created in order to enable unit testing of protected @parseHeaders method
    protected setFormatter(formatter: Formatter) {
        this.formatter = formatter
    }

    protected parseHeaders(headers: Headers, baseUrl: string = ''): string {
        if (headers) {
            const commonHeaders = headers.common as Headers
            const mergedHeaders: Headers = { ...headers, ...commonHeaders }
            delete mergedHeaders.common
            if (mergedHeaders['x-contentful-route'] && baseUrl) { // specific for contentful
                mergedHeaders['x-contentful-route'] = `${baseUrl}${mergedHeaders['x-contentful-route']}`
            }
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
                const formattedHeaderEntry = this.formatter.prettyHeaderEntry({
                    key,
                    value: headers[key],
                }, index === 0, index === headersArray.length - 1)
                headersString.push(formattedHeaderEntry)
            }
        })
        return headersString
    }

}