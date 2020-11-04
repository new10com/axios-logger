import { defaultIndent, defaultIndentChar } from '../constants/constants'

export interface IConfig {
    indentChar: string
    indent: number
    request: RequestConfig
    response: ResponseConfig
}

export interface RequestConfig {
    shouldLogHeaders: boolean
    shouldLogBody: boolean
}

export interface ResponseConfig {
    shouldLogHeaders: boolean
    shouldLogBody: boolean
}

export function defaultConfig(): IConfig {
    return {
        indent: defaultIndent,
        indentChar: defaultIndentChar,
        request: { shouldLogHeaders: true, shouldLogBody: true },
        response: { shouldLogHeaders: true, shouldLogBody: true },
    }
}