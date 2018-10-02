require('dotenv').config()

const { cardsByName } = require('./lib')
const { onMessageCreate } = require('behavior')
const Eris = require('eris')
const fs = require('fs')

const CARD_DATA_SOURCE = 'assets/eternal-cards-1.38.json'

const cardData = JSON.parse(fs.readFileSync(CARD_DATA_SOURCE))
const cardDb = cardsByName(cardData)
console.log(`${Object.keys(cardDb).length} cards loaded`)

const bot = new Eris(process.env.DISCORD_BOT_TOKEN)

bot.on('ready', () => console.log('Ready!'))

bot.on('messageCreate', incomingMsg => {
  onMessageCreate(bot, incomingMsg, cardDb)
})

bot.connect()
