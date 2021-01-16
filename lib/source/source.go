package source

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/mplewis/aegiseek/lib/db"
	"github.com/mplewis/aegiseek/lib/model"
	"github.com/rs/zerolog/log"
)

// Source is a fetcher for the latest Eternal Warcry card data.
type Source struct {
	Interval  time.Duration
	Target    string
	Threshold int
	OnError   func(error)
	expiry    time.Time
	dbase     *db.DB
}

// New builds a card fetcher datasource with the specified interval and performs the initial fetch.
func New(
	Interval time.Duration,
	Target string,
	Threshold int,
	OnError func(error),
) *Source {
	c := &Source{Interval, Target, Threshold, OnError, time.Time{}, nil}
	c.refresh()
	log.Debug().Msg("Initial refresh complete")
	return c
}

// Get gets the parsed cards and queues a refresh if they are stale.
func (c *Source) Get() *db.DB {
	if !c.fresh() {
		go func() {
			c.refresh()
		}()
	}
	return c.dbase
}

// parse parses the Eternal Warcry card JSON into Cards.
func parse(raw []byte) ([]model.Card, error) {
	cards := []model.Card{}
	err := json.Unmarshal(raw, &cards)
	return cards, err
}

// fresh returns true if the cards are fresh and false otherwise.
func (c *Source) fresh() bool {
	now := time.Now()
	fresh := now.Before(c.expiry)
	log.Debug().
		Interface("now", now).
		Interface("expiry", c.expiry).
		Bool("fresh", fresh).
		Msg("Checking freshness")
	return fresh
}

// refresh fetches the cards from the datasource and parses them.
func (c *Source) refresh() {
	log.Debug().Msg("Refreshing")
	resp, err := http.Get(c.Target)
	if err != nil {
		c.OnError(err)
		return
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.OnError(err)
		return
	}
	cards, err := parse(body)
	if err != nil {
		c.OnError(err)
		return
	}
	db := db.New(cards, c.Threshold)
	c.dbase = &db
	c.expiry = time.Now().Add(c.Interval)
	log.Debug().Interface("expiry", c.expiry).Msg("Refreshed")
}
