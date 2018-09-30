const { sanitize } = require('./lib')

describe('sanitize', () => {
  it('lowercases, rims, strips non-alphanumeric, and squishes', () => {
    expect(sanitize('   WISDOM Of the* \t Elders ')).toEqual(
      'wisdom of the elders'
    )
  })
})
