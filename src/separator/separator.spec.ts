import { Separator } from './separator'

describe('Separator Test Suite', () => {
  it(`should test that starting line of request/response is displayed properly`, () => {
    const name = 'Request'
    expect(Separator.startingLine(name)).toEqual(
      `┌────── ${name} ──────────────────────────────────────────────────────────────────────────────────────────────`
    )
  })

  it(`test that ending line of request/response is displayed properly`, () => {
    expect(Separator.endingLine()).toEqual(
      `└─────────────────────────────────────────────────────────────────────────────────────────────────────────────`
    )
  })
})
