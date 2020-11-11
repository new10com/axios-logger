import { deepSpread } from 'deep-spread'
import {
  DEFAULT_INDENT,
  DEFAULT_INDENT_CHAR,
  DEFAULT_REDACTABLE_KEYS
} from '../constants/constants'

export interface IConfig {
  indentChar?: string
  indent?: number
  request?: RequestConfig
  response?: ResponseConfig
  obfuscation?: ObfuscationConfig
}

export interface ObfuscationConfig {
  obfuscate?: boolean
  redactableKeys?: string[]
}

export interface RequestConfig {
  shouldLogHeaders?: boolean
  shouldLogBody?: boolean
}

export interface ResponseConfig {
  shouldLogHeaders?: boolean
  shouldLogBody?: boolean
}

export function defaultConfig(): IConfig {
  return {
    indent: DEFAULT_INDENT,
    indentChar: DEFAULT_INDENT_CHAR,
    obfuscation: { obfuscate: false, redactableKeys: DEFAULT_REDACTABLE_KEYS },
    request: { shouldLogHeaders: true, shouldLogBody: true },
    response: { shouldLogHeaders: true, shouldLogBody: true }
  }
}

export function prepareConfig(config: IConfig): IConfig {
  return deepSpread({ ...defaultConfig(), ...config }, defaultConfig())
}
