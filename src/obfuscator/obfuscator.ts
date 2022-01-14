import redactObject from 'redact-object'
import { ObfuscationConfig } from '../config/axios-logger-config'
import { DEFAULT_REDACTABLE_KEYS } from '../constants/constants'

const getRedactableKeysFromEnv = () => {
  return (process.env.LOGGER_REDACTABLE_KEYS || '').split(',').filter(Boolean)
}

export function getRedactableKeys(config: ObfuscationConfig): string[] {
  const configRedactableKeys = config.redactableKeys
    ? config.redactableKeys
    : DEFAULT_REDACTABLE_KEYS
  return getRedactableKeysFromEnv().length
    ? getRedactableKeysFromEnv()
    : configRedactableKeys
}

export function obfuscate(obj: object, config: ObfuscationConfig): object {
  const redactableKeys = getRedactableKeys(config)
  return redactObject(obj, redactableKeys, undefined, {
    partial: true,
    strict: false,
    ignoreUnknown: true
  })
}
