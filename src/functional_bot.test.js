const { createBot } = require('./functional_bot')

describe('FunctionalBot createBot', () => {
  def('sentMessages', () => [])
  def('erisRegister', () => jest.fn())
  def('mockEris', () => ({
    on: get.erisRegister,
    createMessage: created => get.sentMessages.push(created)
  }))
  def('onReady', () => jest.fn())
  def('bot', () =>
    createBot({
      onReady: get.onReady,
      responsesForMessage: get.responsesForMessage,
      erisInstance: get.mockEris
    })
  )

  describe('creating the bot', () => {
    subject(() => get.bot)

    it('registers the handlers', () => {
      subject()
      const calls = get.erisRegister.mock.calls
      expect(calls[0]).toEqual(['ready', get.onReady])
      expect(calls[1][0]).toEqual('messageCreate')
    })
  })
})
