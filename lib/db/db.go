package db

import (
	"regexp"

	"github.com/agnivade/levenshtein"
	"github.com/mplewis/aegiseek/lib/model"
)

// DB is a database that supports fuzzy searching of Eternal cards.
type DB struct {
	cards     []model.Card
	threshold int
}

// New builds a database for the given cards.
func New(cards []model.Card, threshold int) DB {
	return DB{cards, threshold}
}

func wordCount(ceil int, s string) int {
	m, _ := regexp.Compile(`\S+`)
	r := m.FindAllString(s, ceil)
	if r == nil {
		return 0
	}
	return len(r)
}

// Search finds a card matching a given query.
func (db *DB) Search(query string) *model.Card {
	cDist := db.threshold * wordCount(3, query)
	var cCard *model.Card
	for _, card := range db.cards {
		dist := levenshtein.ComputeDistance(query, card.Name)
		if dist < cDist {
			c := card
			cCard = &c
			cDist = dist
		}
	}
	return cCard
}
