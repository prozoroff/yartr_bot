const request = require('request-promise')
const iconv = require('iconv-lite')
const messages = require('./messages')

const typesDict = ['авт', 'трол', 'трам', 'мар']
const busRoutes = ['35', '35d', '40k', '41', '41a', '41b', '42', '43', '44', '44k', '49', '55', '55k', '70', '72', '76', '78', '93g']

function getRouteInfo(route) {
    const routeObj = parseRoute(route)
    const { type, num } = routeObj

    if (!isCorrectRoute(num) || !type) {
        return new Promise(function (resolve, reject) {
            reject(messages.notFound)
        })
    }

    return request({
        method: 'GET',
        uri: `http://ot76.ru/mob/getroutestr.php?vt=${type}&nmar=${num}`,
        encoding: null
    })
        .then(function (response) {
            return iconv.decode(response, "win1251")
        })
        .catch(function (err) {
            console.log(err)
        })
}

function getForecast(link) {
    return request({
        method: 'GET',
        uri: `http://ot76.ru/mob/${link}`,
        encoding: null
    })
        .then(function (response) {
            return iconv.decode(response, "win1251")
        })
        .catch(function (err) {
            console.log(err)
        })
}

function isCorrectRoute(route) {
    return parseInt(route).toString() !== 'NaN'
}

function parseRoute(route) {
    const splittedRoute = route.split(' ')
    let num, type

    const typeProvided = splittedRoute.length > 1;
    if (typeProvided) {
        const typeStr = splittedRoute[0]
        typesDict.forEach((val, ind) => {
            if (typeStr.includes(val)) {
                type = ind + 1
            }
        })
        num = prepareRouteStr(splittedRoute[splittedRoute.length - 1])
    } else {
        num = prepareRouteStr(route)
        type = getTypeAutomatically(num)
    }

    return { num, type }
}

function prepareRouteStr(str) {
    return str.trim()
        .replace('а', 'a')
        .replace('к', 'k')
        .replace('в', 'v')
        .replace('с', 'c')
        .replace('б', 'b')
        .replace('м', 'm')
        .replace('г', 'g')
}

function getTypeAutomatically(numStr) {
    const num = parseInt(numStr)
    if (['1', '3', '4', '5', '7', '8', '9'].includes(numStr)) {
        return 2
    } else if (numStr === '5') {
        return 3
    } else if (num < 35 || busRoutes.includes(numStr)) {
        return 1
    } else {
        return 4
    }
}

module.exports = { getRouteInfo, getForecast }
