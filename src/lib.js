const _ = require('lodash')

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

function sanitize (name) {
  name = name.toLowerCase()
  name = name.trim()
  name = name.replace(/[^\w\s]/g, '') // strip non-alphanumeric
  name = name.replace(/\s\s+/g, ' ') // replace multiple spaces with one space
  return name
}

module.exports = {
  cardsByName,
  requestedCards,
  sanitize
}
