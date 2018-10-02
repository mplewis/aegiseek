const {
    fetchUrls
} = require('./behavior')

describe('fetchUrls', () => {
    const cardDb = {
        'fire sigil': {
            'DetailsUrl': 'firesigil.html'
        },
        'time sigil': {
            'DetailsUrl': 'timesigil.html'
        },
        'wisdom of the elders': {
            'DetailsUrl': 'wisdom.html'
        }
    }

    describe('single fetch', () => {
        const cards = ['fire sigil']
        it('returns one url', () => {
            expect(fetchUrls(cards, cardDb)).toEqual({
                urls: ['firesigil.html'],
                errors: []
            })
        })
    })

    describe('triple fetch', () => {
        const cards = ['fire sigil', 'time sigil', 'wisdom of the elders']
        it('returns all 3 urls', () => {
            expect(fetchUrls(cards, cardDb)).toEqual({
                urls: ['firesigil.html', 'timesigil.html', 'wisdom.html'],
                errors: []
            })
        })
    })

    describe('bad fetch', () => {
        const cards = ['not a card']
        it('fills error array', () => {
            expect(fetchUrls(cards, cardDb)).toEqual({
                urls: [],
                errors: ['not a card']
            })
        })
    })

    describe('bad and good fetch', () => {
        const cards = ['time sigil', 'not a card', 'fire sigil']
        it('only good goes through', () => {
            expect(fetchUrls(cards, cardDb)).toEqual({
                urls: ['timesigil.html', 'firesigil.html'],
                errors: ['not a card']
            })
        })
    })
})
