const { requestedCards, urlsForCards } = require('./lib')

function replyWithCards ({ cardDb, allCards, msgText }) {
  const messages = []

  const queries = requestedCards(msgText)
  if (queries.length === 0) return []
  console.log(`Found requests for cards: ${queries.join(', ')}`)

  const results = urlsForCards({ queries, cardDb, allCards })
  const { matchingUrls, queriesWithFuzzyMatches, errors } = results

  if (matchingUrls.length > 0) messages.push(matchingUrls.join(' '))
  // TODO: show queriesWithFuzzyMatches
  if (errors.length > 0) {
    const s = errors.length === 1 ? '' : 's'
    messages.push(`Could not find any card${s} named ${errors.join(', ')}`)
  }

  return messages
}

module.exports = { replyWithCards }
