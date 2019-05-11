const TelegramBot = require('node-telegram-bot-api')
const { getRouteInfo, getForecast } = require('./transportService')
const messages = require('./messages')
const renderImage = require('./imageRenderer')

const token = process.env.tgtoken
const bot = new TelegramBot(token, { polling: true })

bot.onText(/\/start/, msg => {
  bot.sendMessage(msg.chat.id, messages.info, { parse_mode: 'Markdown' })
})

const routeRenderMiddlware = doc => {
  const validateCell = val => parseInt(val).toString() !== 'NaN' || val === '-'
  const getLink = row => row.childNodes[5].childNodes[0].getAttribute('href')
  return Array.prototype.slice.call(doc.querySelectorAll('td:nth-child(1)'))
    .filter(el => validateCell(el.innerHTML))
    .map((el, ind) => {
      el.innerHTML = ind + 1
      return [ind + 1, getLink(el.parentNode)]
    })
}

const isEmpty = str => !str.includes('<td')
const extractContent = str => str.split('</body>')[0].split('<body>')[1]
const inRow = arr => {
  const result = []
  let item, row = []
  while (item = arr.shift()) {
    if (row.length === 3) {
      result.push(row.slice(0))
      row = []
    }
    row.push(item)
  }
  if (row.length) {
    result.push(row)
  }
  return result
}

bot.on('message', (msg) => {
  if (msg.text === '/start') return;

  const chatId = msg.chat.id;
  const formatCallback = arr => arr.map(a => ({
    text: a[0],
    callback_data:
      [a[1], chatId].join('_')
  }))

  getRouteInfo(msg.text).then(response => {
    const htmlContent = extractContent(response.toString())

    if (isEmpty(htmlContent)) {
      return bot.sendMessage(chatId, messages.notFound)
    }

    renderImage(htmlContent, routeRenderMiddlware).then(data => {
      const options = {
        reply_markup: JSON.stringify({
          inline_keyboard: inRow(formatCallback(data.middlewareData))
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
  getForecast(link).then(response => {
    const htmlContent = extractContent(response.toString())

    if (isEmpty(htmlContent)) {
      return bot.sendMessage(chatId, messages.notFound)
    }

    renderImage(htmlContent).then(data => {
      bot.sendPhoto(chatId, data.imagePath)
    })
  })
})
