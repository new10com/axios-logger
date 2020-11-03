import { defaultIndent, defaultIndentChar } from '../constants/constants'

export interface IConfig {
    indentChar: string
    indent: number
    request: RequestConfig
    response: ResponseConfig
}

export interface RequestConfig {
    headers: boolean
    body: boolean
}

export interface ResponseConfig {
    headers: boolean
    body: boolean
}

export function defaultConfig(): IConfig {
    return {
        indent: defaultIndent,
        indentChar: defaultIndentChar,
        request: { headers: true, body: true },
        response: { headers: true, body: true },
    }
}