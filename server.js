const Eris = require('eris');

const bot = new Eris(super_secret_token);   // Replace DISCORD_BOT_TOKEN in .env with your bot accounts token

bot.on('ready', () => {                                // When the bot is ready
    console.log('Ready!');                             // Log "Ready!"
});

bot.on('messageCreate', (msg) => {                     // When a message is created
    if(msg.content.includes('YEET')) {                 // If the message content includes "1337"
        bot.createMessage(msg.channel.id, 'YOTE');  // Send a message in the same channel with "damn it"
    }
});

bot.connect();                                         // Get the bot to connect to Discord
