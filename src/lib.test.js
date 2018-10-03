const {
  cardsByName,
  requestedCards,
  fetchUniqueName,
  sanitize,
  fuzzySearch,
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

describe('fuzzySearch', () => {
  const allCards = [
    { Name: 'Umbren Deathwatcher' },
    { Name: "Duelist's Blade" },
    { Name: 'Dueling Pistols' },
    { Name: 'Soaring Stranger' },
    { Name: 'Stonescar Stranger' },
    { Name: 'Stonescar Banner' }
  ]

  it('returns nothing when nothing matches closely', () => {
    expect(fuzzySearch('umbren death watcher', allCards)).toEqual({
      Name: 'Umbren Deathwatcher'
    })
  })

  it('returns the closest match', () => {
    expect(fuzzySearch('umbren death watcher', allCards)).toEqual({
      Name: 'Umbren Deathwatcher'
    })
  })

  it('finds the best match of two', () => {
    expect(fuzzySearch('dullist bling', allCards)).toEqual({
      Name: "Duelist's Blade"
    })
  })

  it('finds the best match of three', () => {
    expect(fuzzySearch('somescone singer', allCards)).toEqual({
      Name: 'Stonescar Stranger'
    })
  })

  it('matches very malformed queries', () => {
    expect(fuzzySearch('united darth stitcher', allCards)).toEqual({
      Name: 'Umbren Deathwatcher'
    })
  })
})

describe('urlsForCards', () => {
  const cardDb = {
    'fire sigil': {
      Name: 'Fire Sigil',
      DetailsUrl: 'firesigil.html'
    },
    'time sigil': {
      Name: 'Time Sigil',
      DetailsUrl: 'timesigil.html'
    },
    'wisdom of the elders': {
      Name: 'Wisdom of the Elders',
      DetailsUrl: 'wisdom.html'
    }
  }

  const allCards = [
    { Name: 'Fire Sigil', DetailsUrl: 'firesigil.html' },
    { Name: 'Time Sigil', DetailsUrl: 'timesigil.html' },
    { Name: 'Wisdom of the Elders', DetailsUrl: 'wisdom.html' }
  ]

  describe('single fetch', () => {
    const queries = ['fire sigil']
    it('returns one url', () => {
      expect(urlsForCards({ queries, cardDb, allCards })).toEqual({
        matchingUrls: ['firesigil.html'],
        queriesWithFuzzyMatches: [],
        errors: []
      })
    })
  })

  describe('triple fetch', () => {
    const queries = ['fire sigil', 'time sigil', 'wisdom of the elders']
    it('returns all 3 urls', () => {
      expect(urlsForCards({ queries, cardDb, allCards })).toEqual({
        matchingUrls: ['firesigil.html', 'timesigil.html', 'wisdom.html'],
        queriesWithFuzzyMatches: [],
        errors: []
      })
    })
  })

  describe('bad fetch', () => {
    const queries = ['not a card']
    it('fills error array', () => {
      expect(urlsForCards({ queries, cardDb, allCards })).toEqual({
        matchingUrls: [],
        queriesWithFuzzyMatches: [],
        errors: ['not a card']
      })
    })
  })

  describe('fuzzy match', () => {
    const queries = ['fira signal']
    it('fills error array', () => {
      expect(urlsForCards({ queries, cardDb, allCards })).toEqual({
        matchingUrls: [],
        queriesWithFuzzyMatches: [
          { query: 'fira signal', name: 'Fire Sigil', url: 'firesigil.html' }
        ],
        errors: []
      })
    })
  })

  describe('bad and good fetch', () => {
    const queries = ['time sigil', 'not a card', 'fire sigil']
    it('only good goes through', () => {
      expect(urlsForCards({ queries, cardDb, allCards })).toEqual({
        matchingUrls: ['timesigil.html', 'firesigil.html'],
        queriesWithFuzzyMatches: [],
        errors: ['not a card']
      })
    })
  })
})
