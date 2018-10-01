require('dotenv').config()

const { requestedCards, cardsByName } = require('./lib')
const { onMessageCreate } = require('behavior')
const Eris = require('eris')
const fs = require('fs')

const CARD_DATA_SOURCE = 'assets/eternal-cards-1.38.json'

const cardData = JSON.parse(fs.readFileSync(CARD_DATA_SOURCE))
const cardDb = cardsByName(cardData)
console.log(`${Object.keys(cardDb).length} cards loaded`)

const bot = new Eris(process.env.DISCORD_BOT_TOKEN)

function send (replyTo, text) {
  bot.createMessage(replyTo.channel.id, text)
  console.log(`< ${text}`)
}

bot.on('ready', () => console.log('Ready!'))

bot.on('messageCreate', incomingMsg => {
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
})

bot.connect()
