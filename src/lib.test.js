const { requestedCards, sanitize } = require('./lib')

describe('requestedCards', () => {
  describe('with no requests', () => {
    const input = 'i spent all my money on mtg sealed tourneys'
    it('returns an empty array', () => {
      expect(requestedCards(input)).toEqual([])
    })
  })

  describe('with one request', () => {
    const input = "i am sick of {{Azindel's Gift}}"
    it('returns the sanitized card name', () => {
      expect(requestedCards(input)).toEqual(['azindels gift'])
    })
  })

  describe('with duplicate requests', () => {
    const input =
      'my deck uses {{Permafrost}}, {{Permafrost}}, and more {{Permafrost}}'
    it('dedupes', () => {
      expect(requestedCards(input)).toEqual(['permafrost'])
    })
  })

  describe('with many requests', () => {
    const input =
      "and then I kill anyone who isn't stunned with {{Vanquish}}, {{Slay}}, {{Harsh Rule}}, " +
      '{{End of Hostilities}}, {{Skycrag Wyvarch}}, and {{Thunderstrike Dragon}}'
    it('returns only the first five', () => {
      expect(requestedCards(input)).toEqual([
        'vanquish',
        'slay',
        'harsh rule',
        'end of hostilities',
        'skycrag wyvarch'
      ])
    })
  })
})

describe('sanitize', () => {
  it('lowercases, rims, strips non-alphanumeric, and squishes', () => {
    expect(sanitize('   WISDOM Of the* \t Elders ')).toEqual(
      'wisdom of the elders'
    )
  })
})
