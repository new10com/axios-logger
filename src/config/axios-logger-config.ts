import {
  DEFAULT_INDENT,
  DEFAULT_INDENT_CHAR,
  DEFAULT_REDACTABLE_KEYS,
} from '../constants/constants'

import { deepSpread } from 'deep-spread'
import type { ReplaceFunction } from 'redact-object'

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
  replaceVal?: string | ReplaceFunction
}

export interface RequestConfig {
  shouldLogHeaders?: boolean
  shouldLogBody?: boolean
  maxLogContentLength?: number // in bytes
}

export interface ResponseConfig {
  shouldLogHeaders?: boolean
  shouldLogBody?: boolean
  maxLogContentLength?: number // in bytes
}

export function defaultConfig(): IConfig {
  return {
    indent: DEFAULT_INDENT,
    indentChar: DEFAULT_INDENT_CHAR,
    obfuscation: { obfuscate: false, redactableKeys: DEFAULT_REDACTABLE_KEYS },
    request: { shouldLogHeaders: true, shouldLogBody: true },
    response: { shouldLogHeaders: true, shouldLogBody: true },
  }
}

export function prepareConfig(config: IConfig): IConfig {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return deepSpread(
    { ...defaultConfig(), ...config },
    defaultConfig()
  ) as IConfig
}
