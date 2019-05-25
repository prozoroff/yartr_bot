const TelegramBot = require('node-telegram-bot-api')
const { getRouteInfo, getForecast } = require('./transportService')
const messages = require('./messages')
const renderImage = require('./imageRenderer')
const { inRow } = require('./utils')
const { routeRenderMiddlware, isEmptyPage, extractContent } = require('./parsing')
const { createHtmlSchedule, createHtmlForecast, isRiverTransport } = require('./riverTransportService')

const token = process.env.tgtoken
const bot = new TelegramBot(token, { polling: true })


bot.onText(/\/start/, msg => {
  bot.sendMessage(msg.chat.id, messages.info, { parse_mode: 'Markdown' })
})

bot.on('message', (msg) => {
  if (msg.text === '/start') return;

  const chatId = msg.chat.id;
  const formatCallback = arr => arr.map(a => ({
    text: a[0],
    callback_data:
      [a[1], chatId].join('_')
  }))

  const formattedMessage = msg.text.toLowerCase().trim()

  if (isRiverTransport(formattedMessage)) {
    const { html, callbacks } = createHtmlSchedule(formattedMessage);
    return renderImage(html).then(data => {
      const options = {
        reply_markup: JSON.stringify({
          inline_keyboard: inRow(formatCallback(callbacks), 2)
        })
      }
      bot.sendPhoto(chatId, data.imagePath, options)
    })
  }

  getRouteInfo(formattedMessage).then(response => {
    const htmlContent = extractContent(response.toString())

    if (isEmptyPage(htmlContent)) {
      return bot.sendMessage(chatId, messages.notFound)
    }

    renderImage(htmlContent, routeRenderMiddlware).then(data => {
      const options = {
        reply_markup: JSON.stringify({
          inline_keyboard: inRow(formatCallback(data.middlewareData), 3)
        })
      }
      bot.sendPhoto(chatId, data.imagePath, options)
    })
  }).catch(err => {
    bot.sendMessage(chatId, err)
  })
})

bot.on('callback_query', (msg) => {
  const [link, chatId] = msg.data.split('_')

  if (link.startsWith('river')) {
    const parts = link.split(':')
    const destination = parts[2]
    const direction = parts[1]
    const routeNumber = parseInt(parts[3])
    
    return renderImage(
      createHtmlForecast(destination, direction, routeNumber)).then(data => {
      bot.sendPhoto(chatId, data.imagePath)
    })
  }

  getForecast(link).then(response => {
    const htmlContent = extractContent(response.toString())

    if (isEmptyPage(htmlContent)) {
      return bot.sendMessage(chatId, messages.error)
    }

    renderImage(htmlContent).then(data => {
      bot.sendPhoto(chatId, data.imagePath)
    })
  })
})

