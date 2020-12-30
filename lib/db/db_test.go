package db_test

import (
	"testing"

	"github.com/mplewis/aegiseek/lib/db"
	"github.com/mplewis/aegiseek/lib/model"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

func TestSuite(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Test Suite")
}

var cards = []model.Card{
	{Name: "Fire Sigil"},
	{Name: "Time Sigil"},
	{Name: "Wisdom of the Elders"},
}

var _ = Describe("DB", func() {
	d := db.New(cards, 3)
	expected := map[string]*model.Card{
		// exact
		"Fire Sigil":           {Name: "Fire Sigil"},
		"Time Sigil":           {Name: "Time Sigil"},
		"Wisdom of the Elders": {Name: "Wisdom of the Elders"},
		// misspelled
		"Fira Signal":         {Name: "Fire Sigil"},
		"Timon Signal":        {Name: "Time Sigil"},
		"Watson of the Elder": {Name: "Wisdom of the Elders"},
		// does not exist
		"Sword of Feast and Famine": nil,
		"Black Lotus":               nil,
		"Ancestral Recall":          nil,
		"Emrakul, the Aeons Torn":   nil,
	}

	It("finds the expected results", func() {
		for query, exp := range expected {
			actual := d.Search(query)
			Expect(actual).To(Equal(exp))
		}
	})
})
