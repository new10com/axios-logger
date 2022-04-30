export const DEFAULT_INDENT = 2
export const DEFAULT_INDENT_CHAR = ' '
export const DEFAULT_REDACTABLE_KEYS = [
  'apiKey',
  'authorization',
  'Authorization',
  'accessToken',
  'idToken',
  'password',
  'refreshToken',
  'token',
  ...(process.env.LOGGER_EXTRA_REDACTABLE_KEYS ?? '')
    .split(',')
    .filter(Boolean),
]
