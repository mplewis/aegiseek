# Aegiseek: [» Add to your server! »](https://discordapp.com/oauth2/authorize?client_id=495803185382948874&scope=bot&permissions=2048)

Look up Eternal cards in Discord. Just type **{{the name of a card}}** and the bot will link to the Eternal Warcry page for that card:

[![Aegiseek screenshot](docs/screenshot.png)](https://discordapp.com/oauth2/authorize?client_id=495803185382948874&scope=bot&permissions=2048)

Written by [mplewis](https://github.com/mplewis), [cookthebook](https://github.com/cookthebook).

# Run in Docker

```sh
docker build . --tag aegiseek
docker run -it -e DISCORD_BOT_TOKEN=YOUR_BOT_USER_TOKEN_HERE aegiseek
```

# License

MIT
