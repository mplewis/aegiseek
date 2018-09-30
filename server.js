const getJSON = require('get-json')
const Eris = require('eris')
const axios = require('axios')

const CARD_DATA_SOURCE = 'https://cdn.glitch.com/a2e17b52-f40b-4236-8302-cde69ff404b2%2Feternal-cards.json'
let cardDb

const bot = new Eris(process.env.SECRET)

bot.on('ready', () => {
  console.log('Ready!')
  cardsByName().then(organized => {
    cardDb = organized
    console.log(`${Object.keys(cardDb).length} cards loaded`)
  })
})

bot.on('messageCreate', (msg) => {
  console.log(msg.content)
  requestedCards(msg).forEach(name => {
    const data = cardDb[name]
    console.log({name, data})
    
    let response
    if (data) {
      response = data['DetailsUrl']
    } else {
      response = `Could not find a card named "${name}"`
    }
    
    bot.createMessage(msg.channel.id, response) 
  })
})

function requestedCards(msg) {
  const query = msg.content
  const matcher = /{{(.+)}}/g
  const results = []

  let match
  while (match = matcher.exec(query)) { results.push(match[1]) }
  return results.map(sanitize)
}

async function cardsByName() {
  const response = await axios(CARD_DATA_SOURCE)
  const byName = {}
  response.data.forEach(cardData => {
    const originalName = cardData['Name']
    const sanitizedName = sanitize(originalName)
    byName[sanitizedName] = cardData
  })
  return byName
}

function sanitize(name) {
  name = name.toLowerCase()
  name = name.trim()
  name = name.replace(/[^\w\s]/g, '') // strip non-alphanumeric
  name = name.replace(/\s\s+/g, ' ') // replace multiple spaces with one space
  return name
}

bot.connect()
