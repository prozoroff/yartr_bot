'use strict';

const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const messages = require('./messages')

const bot = new ViberBot({
	authToken: process.env.vitoken,
	name: "Yartr",
	avatar: "public/avatar.jpg" 
});

bot.onTextMessage(/^help$/i, (message, response) =>
    response.send(new TextMessage(messages.info)));

const https = require('https');
const port = process.env.PORT || 8080;

const webhookUrl = process.env.WEBHOOK_URL;

const httpsOptions = {};
https.createServer(httpsOptions, bot.middleware()).listen(port, () => bot.setWebhook(webhookUrl));