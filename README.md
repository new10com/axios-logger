# Axios Logger

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Coverage Status](https://coveralls.io/repos/github/new10com/axios-logger/badge.svg?branch=master)](https://coveralls.io/github/new10com/axios-logger?branch=master)

> Beautify Axios Logging Messages.

When you send request with [axios](https://github.com/axios/axios) library, it's very helpful to see request/response details. 
Others libraries just outputs it's details in one line, which is not really helpful, when payload is big. So, we decided to improve this situation
and create `Axios Logger` 

Basically This package is working as [Axios's interceptors](https://github.com/axios/axios#interceptors)

## Install

```
$ npm install @new10com/axios-logger
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
instance.get('https://jsonplaceholder.typicode.com/users')
```

Request details will be logged this way:
```
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://jsonplaceholder.typicode.com/users
  Method: @GET
  Headers:
  └ Accept: "application/json, text/plain, */*"
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────
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
instance.get('https://jsonplaceholder.typicode.com/users')
````
Logged response will look like this:
```
┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://jsonplaceholder.typicode.com/users
  Method: @GET
  Status: 200  OK
  Headers
  ┌ date: "Tue, 15 Sep 2020 07:52:33 GMT"
  ├ content-type: "application/json; charset=utf-8"
  ├ transfer-encoding: "chunked"
  ├ connection: "close"
  ├ x-powered-by: "Express"
  ├ x-ratelimit-limit: "1000"
  ├ x-ratelimit-remaining: "998"
  ├ x-ratelimit-reset: "1599014805"
  ├ vary: "Origin, Accept-Encoding"
  ├ access-control-allow-credentials: "true"
  ├ cache-control: "max-age=43200"
  ├ pragma: "no-cache"
  ├ expires: "-1"
  └ cf-ray: "5d30c4d63ff00bf9-AMS"
  Body:
  [
        {
                "id": 1,
                "name": "Leanne Graham",
                "username": "Bret",
                "email": "Sincere@april.biz",
                "address": {
                        "street": "Kulas Light",
                        "suite": "Apt. 556",
                        "city": "Gwenborough",
                        "zipcode": "92998-3874",
                        "geo": {
                                "lat": "-37.3159",
                                "lng": "81.1496"
                        }
                },
                "phone": "1-770-736-8031 x56442",
                "website": "hildegard.org",
                "company": {
                        "name": "Romaguera-Crona",
                        "catchPhrase": "Multi-layered client-server neural-net",
                        "bs": "harness real-time e-markets"
                }
        }
]
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

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

In case of error, you gonna get logged `request`, `response` and `error` all together:
```
┌────── Request ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com/users
  Method: @GET
  Headers:
  ┌ Accept: "application/json, text/plain, */*"
  └ Authorization: "{Super-Secret-Token}"
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────

┌────── Response ──────────────────────────────────────────────────────────────────────────────────────────────
  URL: https://doodle.com/users
  Method: @GET
  Status: 400  Bad Request
  Headers
  ┌
  ├ Content: "application/json"
  └
  Body:
  {
\t"error": "Failure"
  }
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────
┌────── Response Error ──────────────────────────────────────────────────────────────────────────────────────────────
  Message: @Request failed with status code 400
  StackTrace: @Error: Request failed with status code 400
    at createAxiosError (${baseDir}/node_modules/axios-mock-adapter/src/utils.js:148:15)
    at Object.settle (${baseDir}/node_modules/axios-mock-adapter/src/utils.js:127:9)
    at handleRequest (${baseDir}/node_modules/axios-mock-adapter/src/handle_request.js:67:13)
    at ${baseDir}/node_modules/axios-mock-adapter/src/index.js:26:9
    at new Promise (<anonymous>)
    at MockAdapter.<anonymous> (${baseDir}/node_modules/axios-mock-adapter/src/index.js:25:14)
    at dispatchRequest (${baseDir}/node_modules/axios/lib/core/dispatchRequest.js:52:10)
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`
```

### Configuration

Axios Logger has several options that can be configured. Configuration has some default settings, but they can be easily overridden.  

## Indentation

If you would like to have a different indentation of the logs, then you can do it by passing config object: 
```typescript
const config = {indent: 4, indentChar: '\t'}
const logger = AxiosLogger.default()

// or you can use from method
const log4jsLogger = log4js.getLogger('axios')
const axiosLogger = AxiosLogger.from(log4jsLogger, config)
```

## Obfuscation
In case when you don't want to log some confidential information, you would like to hide them and this is now possible in Axios Logger as well:
```typescript
// One way to specify list of "confidential" keys is to use environment variable
process.env.LOGGER_REDACTABLE_KEYS = ['username', 'password']
const envObfuscation: IConfig = {obfuscation: {obfuscate: true}}
const envLogger = AxiosLogger.default(envObfuscation)

// Another way is to directly pass this list of confidential keys to config
const config: IConfig = {obfuscation: {obfuscate: true, redactableKeys: ['username', 'password']}}
const logger = AxiosLogger.default(config)
```

## Filtering level of logging request/response details
In case you would like to reduce amount of details that are logged for request/response, you can disable logging headers of body for either request, response or both: 
```typescript
// Request
// If you want to disabled logging request headers
const config = { request: { shouldLogHeaders: false } }
// If you want to ommit request headers and body
const config = { request: { shouldLogHeaders: false , shouldLogBody: false} }

// Response
// If you want to disabled logging response headers
const config = { response: { shouldLogHeaders: false } }
// If you want to ommit response headers and body
const config = { response: { shouldLogHeaders: false , shouldLogBody: false} }

// Request and Response
// If you want to disabled logging request and response headers
const config = { request: { shouldLogHeaders: false }, response: { shouldLogHeaders: false }  }
// If you want to ommit request+response headers and body
const config = { request: { shouldLogHeaders: false , shouldLogBody: false}, response: { shouldLogHeaders: false , shouldLogBody: false} }
```

## CONTRIBUTE

Suggestions and MR's are welcome :)

## Contributors
<a href="https://github.com/new10com/axios-logger/graphs/contributors">
  <img alt="" src="https://contributors-img.web.app/image?repo=new10com/axios-logger" />
</a>

Made with [contributors-img](https://contributors-img.web.app). 
