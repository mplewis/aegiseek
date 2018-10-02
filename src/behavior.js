const { requestedCards, fetchUniqueName } = require('./lib')

function send (bot, replyTo, text) {
  var messagePromise = bot.createMessage(replyTo.channel.id, text)
  console.log(`< ${text}`)
  return messagePromise
}

function fetchUrls (cards, cardDb) {
  const urls = []
  const errorNames = []

  cards.forEach(name => {
    const fullName = fetchUniqueName(name, cardDb)

    if (fullName) urls.push(cardDb[fullName]['DetailsUrl'])
    else errorNames.push(name)
  })

  return {
    urls: urls,
    errors: errorNames
  }
}

function onMessageCreate (bot, incomingMsg, cardDb) {
  const text = incomingMsg.content
  console.log(`> ${text}`)
  const cards = requestedCards(text)

  if (cards.length === 0) return
  console.log(`Found requests for cards: ${cards.join(', ')}`)

  const found = fetchUrls(cards, cardDb)

  if (found.urls.length > 0) send(bot, incomingMsg, found.urls.join('\n'))
  if (found.errors.length > 0) {
    send(
      bot,
      incomingMsg,
      `Could not find any card named ${found.errors.join(', ')}`
    )
  }
}

module.exports = { onMessageCreate, fetchUrls, send }
