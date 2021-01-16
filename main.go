package main

import (
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/mplewis/aegiseek/lib/message"
	"github.com/mplewis/aegiseek/lib/source"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

const (
	defaultDatasource = "https://eternalwarcry.com/content/cards/eternal-cards.json"
	refreshInterval   = 24 * time.Hour
	threshold         = 3
)

var (
	datasource *source.Source
)

func env(key string) string {
	val := os.Getenv(key)
	if val == "" {
		log.Fatal().Str("key", key).Msg("Missing mandatory environment variable")
	}
	return val
}

func ensure(err error, task string) {
	if err != nil {
		log.Fatal().Err(err).Msg(fmt.Sprintf("Error %s", task))
	}
}

func chill() {
	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt, os.Kill)
	<-sc
}

func strPtr(s string) *string {
	return &s
}

func zerologInit() {
	zerolog.SetGlobalLevel(zerolog.InfoLevel)
	if os.Getenv("DEBUG") != "" {
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	}
	if os.Getenv("DEVELOPMENT") != "" {
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout})
	}
}

func init() {
	zerologInit()
	ds := os.Getenv("DATASOURCE")
	if ds == "" {
		ds = defaultDatasource
	}
	datasource = source.New(refreshInterval, ds, threshold, func(err error) {
		log.Fatal().Err(err).Str("datasource", ds).Msg("Error fetching cards from datasource")
	})
}

func main() {
	sess := connect(env("AUTH_TOKEN"),
		func(s *discordgo.Session, m *discordgo.MessageCreate) {
			if m.Author.ID == s.State.User.ID {
				return
			}
			resp := respond(m.Content)
			if resp == nil {
				return
			}
			log.Info().Str("inUser", m.Author.Username).Str("inMsg", m.Message.Content).Str("message", *resp).Send()
			s.ChannelMessageSend(m.ChannelID, *resp)
		},
	)
	chill()
	log.Info().Msg("Shutting down")
	sess.Close()
}

func connect(token string, handler func(*discordgo.Session, *discordgo.MessageCreate)) *discordgo.Session {
	sess, err := discordgo.New("Bot " + token)
	ensure(err, "creating session")
	sess.AddHandler(handler)
	ensure(sess.Open(), "connecting to Discord")
	me, err := sess.User("@me")
	ensure(err, "getting self details")
	log.Info().Str("username", me.Username).Msg("Connected to Discord")
	return sess
}

func respond(msg string) *string {
	reqs := message.Parse(msg)
	if len(reqs) == 0 {
		return nil
	}

	db := datasource.Get()
	notFound := []string{}
	found := []string{}
	for _, req := range reqs {
		if result := db.Search(req); result == nil {
			notFound = append(notFound, req)
		} else {
			found = append(found, result.DetailsURL)
		}
	}

	foundMsg := strings.Join(found, "\n")
	notFoundMsg := ""
	if len(notFound) > 0 {
		notFoundMsg = fmt.Sprintf("Sorry, I didn't find these cards: %s", strings.Join(notFound, ", "))
	}

	resp := strings.TrimSpace(strings.Join([]string{notFoundMsg, foundMsg}, "\n"))
	if resp == "" {
		return nil
	}
	return strPtr(resp)
}
