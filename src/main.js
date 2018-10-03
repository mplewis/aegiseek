require('dotenv').config()

const { cardsByName } = require('./lib')
const { replyWithCards } = require('./behavior')
const { createBot } = require('./functional_bot')

const fs = require('fs')

const CARD_DATA_SOURCE = 'assets/eternal-cards-1.38.json'

const allCards = JSON.parse(fs.readFileSync(CARD_DATA_SOURCE))
const cardDb = cardsByName(allCards)
console.log(`${Object.keys(cardDb).length} cards loaded`)

const bot = createBot({
  discordBotToken: process.env.DISCORD_BOT_TOKEN,
  onReady: () => console.log('Aegiseek is connected!'),
  responsesForMessage: msg =>
    replyWithCards({ msgText: msg.content, cardDb, allCards })
})
bot.connect()
