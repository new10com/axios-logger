# Axios Logger

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Coveralls](https://img.shields.io/coveralls/alexjoverm/typescript-library-starter.svg)](https://coveralls.io/github/alexjoverm/typescript-library-starter)

> Beautify Axios Logging Messages.

When you send request with [axios](https://github.com/axios/axios) library, it's very helpful to see request/response details. 
Others libraries just outputs it's details in one line, which is not really helpful, when payload is big. So, we decided to improve this situation
and create `Axios Logger` 

Basically This package is working as [Axios's interceptors](https://github.com/axios/axios#interceptors)

## Install

```
$ npm install @new10/axios-logger --save-dev //WIP
```

## How to use

By default `axios-logger` is using [log4js](https://github.com/log4js-node/log4js-node) library under the hood for logging. 

### Logging Request
You can use `AxiosLogger.default()` method if you don't want to customize your logger details
```typescript
const instance = axios.create()
const axiosLogger = AxiosLogger.default()
instance.interceptors.request.use((config) => {
    axiosLogger.logRequest(config)
    return config
})
```

Or you can use custom `log4js` instance with settings that you need:
```typescript
log4js.configure({
    appenders: { axios: { type: 'console', layout: { type: 'colored' }, level: 'debug' } },
    categories: { default: { appenders: ['axios'], level: 'debug' } },
})
const log4jsLogger = log4js.getLogger('axios')
const axiosLogger = AxiosLogger.from(log4jsLogger)

const instance = axios.create()
instance.interceptors.request.use((config) => {
    axiosLogger.logRequest(config)
    return config
})
```

In case you don't want to use `log4js` library, but some other library, then you can use static `AxiosLogger.using` method. The only requirement is that this methods should confrm `LogFn` interface:
```typescript
interface LogFn {
    (msg: string, ...args: any[]): void;
    (obj: object, msg?: string, ...args: any[]): void;
}
```
```typescript
const consola = require('consola')
const axiosLogger = AxiosLogger.using(consola.info, consola.error)

const instance = axios.create()
instance.interceptors.request.use((config) => {
    axiosLogger.logRequest(config)
    return config
})
```


### Logging Response

```typescript
const instance = axios.create()
const axiosLogger = AxiosLogger.default()
instance.interceptors.response.use((response) => {
    axiosLogger.logResponse(response)
    return response
})
````

### Error

You can inject `logError` right after `logRequest` or `logResponse`.

```typescript
const instance = axios.create()
const axiosLogger = AxiosLogger.default()

instance.interceptors.request.use((config) => {
    axiosLogger.logRequest(config)
    return config
}, (error) => {
    axiosLogger.logErrorDetails(error)
    return Promise.reject(error)
})

instance.interceptors.response.use((response) => {
    axiosLogger.logResponse(response)
    return response
}, (error) => {
    axiosLogger.logErrorDetails(error)
    return Promise.reject(error)
})
```

## CONTRIBUTE

Suggestions and MR's are welcome :) 
