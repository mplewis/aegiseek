package model

// Card represents a single Eternal card.
type Card struct {
	SetNumber     int
	EternalID     int
	Name          string
	CardText      string
	Cost          int
	Influence     string
	Attack        int
	Health        int
	Rarity        string
	Type          string
	ImageURL      string `json:"ImageUrl"`
	DetailsURL    string `json:"DetailsUrl"`
	DeckBuildable bool
}
