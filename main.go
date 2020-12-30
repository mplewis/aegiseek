package main

import (
	"os"
	"time"

	"github.com/mplewis/aegiseek/lib/db"
	"github.com/mplewis/aegiseek/lib/source"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

var defaultDatasource = "https://eternalwarcry.com/content/cards/eternal-cards.json"
var refreshInterval = 24 * time.Hour

func main() {
	zerolog.SetGlobalLevel(zerolog.InfoLevel)
	if os.Getenv("DEBUG") != "" {
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	}
	if os.Getenv("DEVELOPMENT") != "" {
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout})
	}

	datasource := os.Getenv("DATASOURCE")
	if datasource == "" {
		datasource = defaultDatasource
	}

	s := source.New(refreshInterval, datasource, func(err error) {
		log.Fatal().Err(err).Str("datasource", datasource).Msg("Error fetching cards from datasource")
	})

	queries := []string{
		"Fire Sigil",
		"Wisdom of the Elders",
		"Fira Signal",
		"Timon Signal",
		"Watson of the Elder",
		"Sword of Feast and Famine",
		"Black Lotus",
		"Time Sigil",
		"Watson of the Elder",
		"Ancestral Recall",
		"Emrakul, the Aeons Torn",
	}

	d := db.New(s.Get(), 3)

	for _, query := range queries {
		card := d.Search(query)
		name := "<Not found>"
		if card != nil {
			name = card.Name
		}
		log.Info().Str("query", query).Interface("result", name).Send()
	}
}
