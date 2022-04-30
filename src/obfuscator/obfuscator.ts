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
  config,
}: {
  obj: Record<string, unknown>
  config: ObfuscationConfig
}): Record<string, unknown> {
  const redactableKeys = getRedactableKeys(config)
  return redactObject(obj, redactableKeys, config.replaceVal, {
    partial: true,
    strict: false,
    ignoreUnknown: true,
  }) as Record<string, unknown>
}
