const { replyWithCards } = require('./behavior')

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

const allCards = [
  { Name: 'Fire Sigil' },
  { Name: 'Time Sigil' },
  { Name: 'Wisdom of the Elders' }
]

describe('replyWithCards', () => {
  it('does not answer none', () => {
    expect(
      replyWithCards({
        msgText: 'One With Nothing is the best MTG card',
        cardDb,
        allCards
      })
    ).toEqual([])
  })

  it('answers one', () => {
    expect(
      replyWithCards({
        msgText: 'Start with {{Fire Sigil}}',
        cardDb,
        allCards
      })
    ).toEqual(['firesigil.html'])
  })

  it('answers two', () => {
    expect(
      replyWithCards({
        msgText: 'Then play {{Fire Sigil}} and {{Wisdom of the Elders}}',
        cardDb,
        allCards
      })
    ).toEqual(['firesigil.html wisdom.html'])
  })

  it('answers errors', () => {
    expect(
      replyWithCards({
        msgText: 'Next play {{Sword of Feast and Famine}} and {{Black Lotus}}',
        cardDb,
        allCards
      })
    ).toEqual([
      'Could not find any cards named sword of feast and famine, black lotus'
    ])
  })

  it('answers everything', () => {
    expect(
      replyWithCards({
        msgText:
          'Then play {{Fire Sigil}} and {{Time Sigil}} followed by {{Ancestral Recall}} and {{Emrakul, the Aeons Torn}}',
        cardDb,
        allCards
      })
    ).toEqual([
      'firesigil.html timesigil.html',
      'Could not find any cards named ancestral recall, emrakul the aeons torn'
    ])
  })
})
