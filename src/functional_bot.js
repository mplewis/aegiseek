const Eris = require('eris')

function createBot ({
  discordBotToken,
  onReady,
  responsesForMessage,
  erisInstance
}) {
  const bot = erisInstance || new Eris(discordBotToken)

  function send ({ replyTo, text }) {
    bot.createMessage(replyTo.channel.id, text)
    console.log(`< ${text}`)
  }

  bot.on('ready', onReady)
  bot.on('messageCreate', function (incomingMsg) {
    console.log(`> ${incomingMsg.content}`)
    const responses = responsesForMessage(incomingMsg)
    if (!responses) return
    responses.forEach(text => send({ replyTo: incomingMsg, text }))
  })

  return bot
}

module.exports = { createBot }
