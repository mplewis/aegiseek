package db

import (
	"regexp"

	"github.com/agnivade/levenshtein"
	"github.com/mplewis/aegiseek/lib/model"
)

var wcMatch *regexp.Regexp

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
	if wcMatch == nil {
		wcMatch = regexp.MustCompile(`\S+`)
	}
	r := wcMatch.FindAllString(s, ceil)
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
