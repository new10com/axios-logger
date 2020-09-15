import { indent } from '../constants/constants'

export interface Headers {
    [key: string]: string | object
}

export interface HeaderRecord {
    key: string
    value: string | object
}

export class Formatter {
    public static title(detailName: string): string {
        return `  ${detailName}`
    }

    public static prettyFormatBody(body: string | object): string {
        let bodyAsString = ''
        switch (typeof body) {
            case 'string':
                if (body.charAt(0) === '{') {
                    bodyAsString = indent + JSON.stringify(JSON.parse(body), null, '\t')
                } else {
                    bodyAsString = indent + body
                }
                break
            case 'object':
                bodyAsString = indent + JSON.stringify(body, null, '\t')
                break
        }
        const lastCurlyBracket = bodyAsString.lastIndexOf('}')

        return lastCurlyBracket > 0
            ? bodyAsString.substr(0, lastCurlyBracket) +
            `${indent}` +
            bodyAsString.substr(lastCurlyBracket)
            : bodyAsString
    }


    public static prettyHeaderEntry(
        headerEntry: HeaderRecord,
        isFirstElement: boolean,
        isLastElement: boolean,
    ): string {
        const startingBracket = '┌'
        const middleBracket = '├'
        const endingBracket = '└'
        const headerString = `${headerEntry.key}: "${headerEntry.value}"`
        if (isFirstElement && isLastElement) {
            return [
                `${indent}${startingBracket}`,
                `${indent}${middleBracket} ${headerString}`,
                `${indent}${endingBracket}`,
            ].join('\n')
        }
        if (isFirstElement) {
            return `${indent}${startingBracket} ${headerString}`
        }
        if (isLastElement) {
            return `${indent}${endingBracket} ${headerString}`
        }
        return `${indent}${middleBracket} ${headerString}`
    }
}