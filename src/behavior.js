function send (bot, replyTo, text) {
  bot.createMessage(replyTo.channel.id, text)
  console.log(`< ${text}`)
}

function onMessageCreate (bot, incomingMsg) {
  const text = incomingMsg.content
  console.log(`> ${text}`)
  const cards = requestedCards(text)

  if (cards.length === 0) return
  console.log(`Found requests for cards: ${cards.join(', ')}`)

  const urls = []
  const errorNames = []

  cards.forEach(name => {
    const data = cardDb[name]
    if (data) urls.push(data['DetailsUrl'])
    else errorNames.push(name)
  })

  if (urls.length > 0) send(incomingMsg, urls.join('\n'))
  if (errorNames.length > 0) {
    send(incomingMsg, `Could not find any card named ${errorNames.join(', ')}`)
  }
}

module.exports = { onMessageCreate }
