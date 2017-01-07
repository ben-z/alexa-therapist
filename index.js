'use strict';

let util = require('util');
let http = require('http');
let Bot  = require('@kikinteractive/kik');

// Configure the bot API endpoint, details for your bot
let bot = new Bot({
    username: process.env['KIK_BOT_USERNAME'] || 'hackvalley',
    apiKey: process.env['KIK_BOT_API_KEY'] || 'bedc16ba-29ba-4b26-b612-15fc26e8f786',
    baseUrl: process.env['KIK_BOT_NGROK_URL'] || 'https://5b57acf5.ngrok.io'
});

bot.updateBotConfiguration();

bot.onStartChattingMessage((message) => {
    bot.getUserProfile(message.from)
        .then((user) => {
            message.reply(`Hey ${user.firstName}!`);
        });
});

bot.onTextMessage((message) => {
    message.reply(`${message.body}!`);
});

// Set up your server and start listening
let server = http
    .createServer(bot.incoming())
    .listen(process.env.PORT || 8080);
