require('dotenv').config()

const _ = require('lodash')
const Eris = require('eris')

const fs = require('fs')

const CARD_DATA_SOURCE = 'assets/eternal-cards-1.38.json'
const MAX_CARDS_TO_RETURN = 5

function requestedCards (query) {
  const matcher = /{{([^}]+)}}/g
  const results = []
  let match
  while ((match = matcher.exec(query))) results.push(match[1])
  return _.uniq(results.map(sanitize).slice(0, MAX_CARDS_TO_RETURN))
}

function cardsByName () {
  const data = JSON.parse(fs.readFileSync(CARD_DATA_SOURCE))
  const byName = {}
  data.forEach(cardData => {
    const originalName = cardData['Name']
    const sanitizedName = sanitize(originalName)
    byName[sanitizedName] = cardData
  })
  return byName
}

function sanitize (name) {
  name = name.toLowerCase()
  name = name.trim()
  name = name.replace(/[^\w\s]/g, '') // strip non-alphanumeric
  name = name.replace(/\s\s+/g, ' ') // replace multiple spaces with one space
  return name
}

const cardDb = cardsByName()
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
