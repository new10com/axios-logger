import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { indent } from '../constants/constants'
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


    public parseError(error: AxiosError, errorSource: ErrorSource): string {
        const startOfRequest = Separator.startingLine(`${errorSource} Error`)
        const code =
            error.code === undefined ? '' : `${Formatter.title('Code')}: ${error.code}`
        const message = `${Formatter.title('Message')}: @${error.message}`
        const stackTrace = `${Formatter.title('StackTrace')}: @${error.stack}`
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
            if (url.includes("://")) {
                return url
            }
            if (baseURL && !url.includes("://")) {
                return `${baseURL}/${url}`
            }
        }
        return url
    }

    public parseRequest(request: AxiosRequestConfig): string {
        let requestDetailsArr
        const startOfRequest = Separator.startingLine('Request')
        const url = `${Formatter.title('URL')}: ${this.parseUrl(request)}`
        const method = `${Formatter.title(
            'Method',
        )}: @${(request.method as string).toUpperCase()}`
        const headersName = `${Formatter.title('Headers')}:`
        const baseUrl = request.baseURL
        const headers = this.parseHeaders(request.headers, baseUrl)
        requestDetailsArr = [
            Separator.newLine(),
            startOfRequest,
            url,
            method,
            headersName,
            headers,
        ]
        if (request.data) {
            const bodyTitle = `${Formatter.title('Body')}:`
            const body = Formatter.prettyFormatBody(request.data)
            requestDetailsArr = [...requestDetailsArr, bodyTitle, body]
        }
        return [...requestDetailsArr, Separator.endingLine()].join('\n')
    }

    public parseResponse(resp: AxiosResponse): string {
        let responseDetailsArr
        const startOfRequest = Separator.startingLine('Response')
        const url = `${Formatter.title('URL')}: ${this.parseUrl(resp.config)}`
        const method = `${Formatter.title('Method')}: @${(resp.config
            .method as string).toUpperCase()}`
        const status = `${Formatter.title('Status')}: ${resp.status} \ ${
            resp.statusText
        }`
        const headersName = `${Formatter.title('Headers')}`
        const baseUrl = resp.config.baseURL
        const headers = this.parseHeaders(resp.headers, baseUrl)
        responseDetailsArr = [
            Separator.newLine(),
            startOfRequest,
            url,
            method,
            status,
            headersName,
            headers,
            `${Formatter.title('Body')}:`,
        ]
        let body = `${indent}{}`
        if (resp.data) {
            body = Formatter.prettyFormatBody(resp.data)
        }
        return [...responseDetailsArr, body, Separator.endingLine()].join('\n')
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
                const formattedHeaderEntry = Formatter.prettyHeaderEntry(
                    {
                        key,
                        value: headers[key],
                    },
                    index === 0,
                    index === headersArray.length - 1,
                )
                headersString.push(formattedHeaderEntry)
            }
        })
        return headersString
    }

}