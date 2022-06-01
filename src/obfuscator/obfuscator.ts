import type { ObfuscationConfig } from '../config/axios-logger-config'
import { DEFAULT_REDACTABLE_KEYS } from '../constants/constants'

import redactObject from 'redact-object'

const getRedactableKeysFromEnv = () => {
  return (process.env.LOGGER_REDACTABLE_KEYS ?? '').split(',').filter(Boolean)
}

export function getRedactableKeys(config: ObfuscationConfig): string[] {
  const configRedactableKeys = config.redactableKeys
    ? config.redactableKeys
    : DEFAULT_REDACTABLE_KEYS
  return getRedactableKeysFromEnv().length
    ? getRedactableKeysFromEnv()
    : configRedactableKeys
}

export function obfuscate({
  obj,
  obfuscationConfig,
}: {
  obj: Record<string, unknown>
  obfuscationConfig: ObfuscationConfig
}): Record<string, unknown> {
  const redactableKeys = getRedactableKeys(obfuscationConfig)
  return redactObject(obj, redactableKeys, obfuscationConfig.replaceVal, {
    partial: true,
    strict: false,
    ignoreUnknown: true,
  }) as Record<string, unknown>
}

export function obfuscateFormData({
  input,
  obfuscationConfig,
}: {
  input: string
  obfuscationConfig: ObfuscationConfig
}): string {
  const redactableKeys = getRedactableKeys(obfuscationConfig)
  return input
    .split('&')
    .map((pair) => {
      const [key, value] = pair.split('=')
      if (redactableKeys.includes(key)) {
        const redactedValue =
          obfuscationConfig.replaceVal === undefined
            ? '[ REDACTED ]'
            : typeof obfuscationConfig.replaceVal === 'string'
            ? obfuscationConfig.replaceVal
            : obfuscationConfig.replaceVal(value, key)
        return `${key}=${redactedValue}`
      }
      return `${key}=${value}`
    })
    .join('&')
}
