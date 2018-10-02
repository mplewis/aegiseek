const {
  cardsByName,
  requestedCards,
  fetchUniqueName,
  sanitize,
  urlsForCards
} = require('./lib')

describe('cardsByName', () => {
  describe('given cards in the Eternal Warcry JSON format', () => {
    const rawCards = [
      { Name: 'Valkyrie Enforcer', Cost: 3, Attack: 3, Health: 3 },
      { Name: 'Serpent Hatchling', Cost: 2, Attack: 2, Health: 2 }
    ]
    it('keys cards by sanitized name', () => {
      expect(cardsByName(rawCards)).toEqual({
        'valkyrie enforcer': {
          Name: 'Valkyrie Enforcer',
          Cost: 3,
          Attack: 3,
          Health: 3
        },
        'serpent hatchling': {
          Name: 'Serpent Hatchling',
          Cost: 2,
          Attack: 2,
          Health: 2
        }
      })
    })
  })
})

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

describe('fetchUniqueName', () => {
  const sampleCardData = {
    'fire sigil': null,
    'shadow sigil': null,
    'time sigil': null
  }

  describe('matching string', () => {
    it('returns the string back', () => {
      expect(fetchUniqueName('fire sigil', sampleCardData)).toEqual(
        'fire sigil'
      )
    })
  })

  describe('not unique substring', () => {
    it('returns null', () => {
      expect(fetchUniqueName('sigil', sampleCardData)).toEqual(null)
    })
  })

  describe('unique substring', () => {
    it('returns full sanitized card name', () => {
      expect(fetchUniqueName('fire', sampleCardData)).toEqual('fire sigil')
    })
  })

  describe('no substring', () => {
    it('returns null', () => {
      expect(fetchUniqueName('not a card', sampleCardData)).toEqual(null)
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

describe('urlsForCards', () => {
  const cardDb = {
    'fire sigil': {
      DetailsUrl: 'firesigil.html'
    },
    'time sigil': {
      DetailsUrl: 'timesigil.html'
    },
    'wisdom of the elders': {
      DetailsUrl: 'wisdom.html'
    }
  }

  describe('single fetch', () => {
    const cards = ['fire sigil']
    it('returns one url', () => {
      expect(urlsForCards(cards, cardDb)).toEqual({
        urls: ['firesigil.html'],
        errors: []
      })
    })
  })

  describe('triple fetch', () => {
    const cards = ['fire sigil', 'time sigil', 'wisdom of the elders']
    it('returns all 3 urls', () => {
      expect(urlsForCards(cards, cardDb)).toEqual({
        urls: ['firesigil.html', 'timesigil.html', 'wisdom.html'],
        errors: []
      })
    })
  })

  describe('bad fetch', () => {
    const cards = ['not a card']
    it('fills error array', () => {
      expect(urlsForCards(cards, cardDb)).toEqual({
        urls: [],
        errors: ['not a card']
      })
    })
  })

  describe('bad and good fetch', () => {
    const cards = ['time sigil', 'not a card', 'fire sigil']
    it('only good goes through', () => {
      expect(urlsForCards(cards, cardDb)).toEqual({
        urls: ['timesigil.html', 'firesigil.html'],
        errors: ['not a card']
      })
    })
  })
})
