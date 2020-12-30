package main

import (
	"fmt"
	"os"
	"time"

	"github.com/mplewis/aegiseek/lib/source"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

var defaultDatasource = "https://eternalwarcry.com/content/cards/eternal-cards.json"

func main() {
	zerolog.SetGlobalLevel(zerolog.InfoLevel)
	if os.Getenv("DEBUG") != "" {
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	}
	if os.Getenv("DEVELOPMENT") != "" {
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout})
	}

	ds := os.Getenv("DATASOURCE")
	if ds == "" {
		ds = defaultDatasource
	}

	s := source.New(
		10*time.Second,
		ds,
		func(err error) {
			log.Fatal().Err(err).Str("datasource", ds).Msg("Error fetching cards from datasource")
		},
	)

	for {
		fmt.Printf("Cards: %d\n", len(s.Get()))
		time.Sleep(1 * time.Second)
	}
}
