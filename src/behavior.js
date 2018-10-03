const { requestedCards, urlsForCards } = require('./lib')

function replyWithCards ({ cardDb, msgText }) {
  const messages = []

  const cards = requestedCards(msgText)
  if (cards.length === 0) return []
  console.log(`Found requests for cards: ${cards.join(', ')}`)

  const { urls, errors } = urlsForCards(cards, cardDb)
  if (urls.length > 0) messages.push(urls.join(' '))
  if (errors.length > 0) {
    const s = errors.length === 1 ? '' : 's'
    messages.push(`Could not find any card${s} named ${errors.join(', ')}`)
  }

  return messages
}

module.exports = { replyWithCards }
