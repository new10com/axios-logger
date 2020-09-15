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

    public parseRequest(request: AxiosRequestConfig): string {
        let requestDetailsArr
        const startOfRequest = Separator.startingLine('Request')
        const url = `${Formatter.title('URL')}: ${request.url}`
        const method = `${Formatter.title(
            'Method',
        )}: @${(request.method as string).toUpperCase()}`
        const headersName = `${Formatter.title('Headers')}:`
        const headers = this.parseHeaders(request.headers)
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
        const url = `${Formatter.title('URL')}: ${resp.config.url}`
        const method = `${Formatter.title('Method')}: @${(resp.config
            .method as string).toUpperCase()}`
        const status = `${Formatter.title('Status')}: ${resp.status} \ ${
            resp.statusText
        }`
        const headersName = `${Formatter.title('Headers')}`
        const headers = this.parseHeaders(resp.headers)
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