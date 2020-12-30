package main

import (
	"os"
	"time"

	"github.com/mplewis/aegiseek/lib/message"
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

	// s := source.New(refreshInterval, datasource, func(err error) {
	// 	log.Fatal().Err(err).Str("datasource", datasource).Msg("Error fetching cards from datasource")
	// })

	answers := message.Parse("Then play {{Fire Sigil}} and {{Time Sigil}} followed by {{Watson of the Elder}}, {{Ancestral Recall}}, and {{Emrakul, the Aeons Torn}}")
	log.Info().Interface("answers", answers).Send()
}
