import { suite, test } from '@testdeck/mocha'
import { expect } from 'chai'
import { Separator } from '../src/separator/separator'

describe('Separator Test Suite', () => {

    @suite('Separator Test Suite')
    class AxiosLoggerTestSuite extends Separator {
        @test
        'Test that starting line of request/response is displayed properly'() {
            const name = 'Request'
            expect(Separator.startingLine(name)).to.equal(
                `┌────── ${name} ──────────────────────────────────────────────────────────────────────────────────────────────`,
            )
        }

        @test
        'Test that ending line of request/response is displayed properly'() {
            expect(Separator.endingLine()).to.equal(
                `└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`,
            )
        }
    }
})
