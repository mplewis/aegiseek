const { createBot } = require('./functional_bot')

describe('FunctionalBot createBot', () => {
  def('sentMessages', () => [])
  def('registeredHandlers', () => ({}))
  def('mockEris', () => ({
    on: (name, fn) => (get.registeredHandlers[name] = fn),
    createMessage: (channelId, text) =>
      get.sentMessages.push({ channelId, text })
  }))

  describe('creating the bot', () => {
    def('onReady', () => jest.fn())
    beforeEach(() => {
      createBot({
        erisInstance: get.mockEris,
        onReady: get.onReady,
        responsesForMessage: get.responsesForMessage
      })
    })

    it('registers the handlers', () => {
      subject()
      expect(Object.keys(get.registeredHandlers)).toEqual([
        'ready',
        'messageCreate'
      ])
      expect(get.registeredHandlers.ready).toEqual(get.onReady)
    })

    describe('responding to messages with multiple messages', () => {
      def('responsesForMessage', () => msg => {
        const input = msg.content
        return [`${input}?`, `${input}!`]
      })
      subject(() =>
        get.registeredHandlers.messageCreate({
          channel: { id: 1234 },
          content: 'hello'
        })
      )

      it('sends the expected messages', () => {
        subject()
        expect(get.sentMessages).toEqual([
          { channelId: 1234, text: 'hello?' },
          { channelId: 1234, text: 'hello!' }
        ])
      })
    })
  })
})
