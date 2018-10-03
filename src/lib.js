const _ = require('lodash')
const Fuse = require('fuse.js')

const MAX_CARDS_TO_RETURN = 5

function cardsByName (cardsData) {
  const byName = {}
  cardsData.forEach(cardData => {
    const originalName = cardData['Name']
    const sanitizedName = sanitize(originalName)
    byName[sanitizedName] = cardData
  })
  return byName
}

function requestedCards (query) {
  const matcher = /{{([^}]+)}}/g
  const results = []
  let match
  while ((match = matcher.exec(query))) results.push(match[1])
  return _.uniq(results.map(sanitize).slice(0, MAX_CARDS_TO_RETURN))
}

// TODO: Extract searchers into new module
function fetchUniqueName (name, cardDB) {
  if (name in cardDB) {
    return name
  } else {
    const matches = Object.keys(cardDB).filter(cardName =>
      cardName.includes(name)
    )

    if (matches.length === 1) return matches[0]
    else return null
  }
}

function sanitize (name) {
  name = name.toLowerCase()
  name = name.trim()
  name = name.replace(/[^\w\s]/g, '') // strip non-alphanumeric
  name = name.replace(/\s\s+/g, ' ') // replace multiple spaces with one space
  return name
}

// TODO: Extract searchers into new module
function fuzzySearch (query, allCards) {
  const fuse = new Fuse(allCards, {
    shouldSort: true,
    threshold: 0.5,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['Name']
  })
  const results = fuse.search(query)
  if (results.count === 0) return null
  return results[0]
}

function urlsForCards ({ queries, cardDb, allCards }) {
  const matchingUrls = []
  const queriesWithFuzzyMatches = []
  const errors = []

  queries.forEach(query => {
    const fullName = fetchUniqueName(query, cardDb)
    if (fullName) {
      matchingUrls.push(cardDb[fullName]['DetailsUrl'])
      return
    }

    const result = fuzzySearch(query, allCards)
    if (result) {
      queriesWithFuzzyMatches.push({
        query: query,
        name: result.Name,
        url: result.DetailsUrl
      })
      return
    }

    errors.push(query)
  })

  return { matchingUrls, queriesWithFuzzyMatches, errors }
}

module.exports = {
  cardsByName,
  requestedCards,
  fetchUniqueName,
  sanitize,
  fuzzySearch,
  urlsForCards
}
