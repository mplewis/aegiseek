const { urlsForCards, replyWithCards } = require('./behavior')

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

describe('urlsForCards', () => {
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

describe('replyWithCards', () => {
  describe('does not answer none', () => {
    expect(
      replyWithCards({
        msgText: 'One With Nothing is the best MTG card',
        cardDb
      })
    ).toEqual([])
  })

  describe('answers one', () => {
    expect(
      replyWithCards({
        msgText: 'Start with {{Fire Sigil}}',
        cardDb
      })
    ).toEqual(['firesigil.html'])
  })

  describe('answers two', () => {
    expect(
      replyWithCards({
        msgText: 'Then play {{Fire Sigil}} and {{Wisdom of the Elders}}',
        cardDb
      })
    ).toEqual(['firesigil.html wisdom.html'])
  })

  describe('answers errors', () => {
    expect(
      replyWithCards({
        msgText: 'Next play {{Time Walk}} and {{Black Lotus}}',
        cardDb
      })
    ).toEqual(['Could not find any cards named time walk, black lotus'])
  })

  describe('answers everything', () => {
    expect(
      replyWithCards({
        msgText:
          'Then play {{Fire Sigil}} and {{Time Sigil}} followed by {{Ancestral Recall}} and {{Emrakul, the Aeons Torn}}',
        cardDb
      })
    ).toEqual([
      'firesigil.html timesigil.html',
      'Could not find any cards named ancestral recall, emrakul the aeons torn'
    ])
  })
})
