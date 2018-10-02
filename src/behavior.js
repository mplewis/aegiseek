const { requestedCards, fetchUniqueName } = require('./lib')

// TODO: Move to lib
function urlsForCards (cards, cardDb) {
  const urls = []
  const errors = []

  cards.forEach(name => {
    const fullName = fetchUniqueName(name, cardDb)
    if (fullName) urls.push(cardDb[fullName]['DetailsUrl'])
    else errors.push(name)
  })

  return { urls, errors }
}

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

module.exports = { replyWithCards, urlsForCards }
