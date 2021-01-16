package message

import "regexp"

var parser *regexp.Regexp

// Parse parses an incoming Discord message and returns a list of requested cards.
func Parse(msg string) []string {
	if parser == nil {
		parser = regexp.MustCompile(`{{([^}]+)}}`)
	}
	matches := parser.FindAllStringSubmatch(msg, -1)
	if matches == nil {
		return []string{}
	}
	m := []string{}
	for _, match := range matches {
		m = append(m, match[1])
	}
	return m
}
