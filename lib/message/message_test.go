package message_test

import (
	"testing"

	"github.com/mplewis/aegiseek/lib/message"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

func TestSuite(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Test Suite")
}

var _ = Describe("message", func() {
	Describe("Parse", func() {
		It("parses card names from a well-formatted message as expected", func() {
			Expect(message.Parse("honestly i dont really like eternal")).To(Equal([]string{}))
			Expect(message.Parse("have you tried {{Sandstorm Titan}}?")).To(Equal([]string{"Sandstorm Titan"}))
			Expect(message.Parse(
				"Then play {{Fire Sigil}} and {{Time Sigil}} followed by " +
					"{{Watson of the Elder}}, {{Ancestral Recall}}, and {{Emrakul, the Aeons Torn}}",
			)).To(Equal([]string{
				"Fire Sigil", "Time Sigil", "Watson of the Elder", "Ancestral Recall", "Emrakul, the Aeons Torn",
			}))
		})
	})
})
