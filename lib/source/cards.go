package source

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/mplewis/aegiseek/lib/model"
)

// Cards is a fetcher for the latest Eternal Warcry card data.
type Cards struct {
	Interval time.Duration
	Target   string
	OnError  func(error)
	last     time.Time
	cards    []model.Card
}

// New builds a card fetcher datasource with the specified interval and performs the initial fetch.
func New(
	Interval time.Duration,
	Target string,
	OnError func(error),
) *Cards {
	c := &Cards{Interval, Target, OnError, time.Time{}, nil}
	c.refresh()
	return c
}

// Get gets the parsed cards and queues a refresh if they are stale.
func (c *Cards) Get() []model.Card {
	if !c.fresh() {
		go func() {
			c.refresh()
		}()
	}
	return c.cards
}

// parse parses the Eternal Warcry card JSON into Cards.
func parse(raw []byte) ([]model.Card, error) {
	cards := []model.Card{}
	err := json.Unmarshal(raw, &cards)
	return cards, err
}

// fresh returns true if the cards are fresh and false otherwise.
func (c *Cards) fresh() bool {
	return time.Now().After(c.last.Add(c.Interval))
}

// refresh fetches the cards from the datasource and parses them.
func (c *Cards) refresh() {
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
	c.cards = cards
	c.last = time.Now()
}
