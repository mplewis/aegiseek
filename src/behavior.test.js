const { replyWithCards } = require('./behavior')

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

  it('answers one fuzzy', () => {
    expect(
      replyWithCards({
        msgText: 'Try another {{Fira Signal}}',
        cardDb,
        allCards
      })
    ).toEqual([
      'Could not find fira signal. Did you mean Fire Sigil? firesigil.html'
    ])
  })

  it('answers two fuzzy', () => {
    expect(
      replyWithCards({
        msgText: 'Follow with {{Timon Signal}} and {{Watson of the Elder}}',
        cardDb,
        allCards
      })
    ).toEqual([
      'Could not find timon signal. Did you mean Time Sigil? timesigil.html',
      'Could not find watson of the elder. Did you mean Wisdom of the Elders? wisdom.html'
    ])
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
          'Then play {{Fire Sigil}} and {{Time Sigil}} followed by {{Watson of the Elder}}, {{Ancestral Recall}}, and {{Emrakul, the Aeons Torn}}',
        cardDb,
        allCards
      })
    ).toEqual([
      'firesigil.html timesigil.html',
      'Could not find watson of the elder. Did you mean Wisdom of the Elders? wisdom.html',
      'Could not find any cards named ancestral recall, emrakul the aeons torn'
    ])
  })
})
