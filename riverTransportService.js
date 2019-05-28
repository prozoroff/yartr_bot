const riverSchedule = require('./riverSchedule')

function getOffsetTime () {
    var local = new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"});
    return new Date(local);
}

//skip routes of other days
const now = getOffsetTime()
const dayOfWeek = now.getDay() - 1
const isOk = arr => arr.length === 1 && arr[0] === dayOfWeek || arr[0] <= dayOfWeek && arr[1] >= dayOfWeek;
Object.keys(riverSchedule).forEach(k => {
    const schedule = riverSchedule[k]
    schedule.straight = schedule.straight.filter(s => !Array.isArray(s[0]) || isOk(s[0])).map(s => Array.isArray(s[0]) ? s.slice(1) : s)
    schedule.back = schedule.back.filter(s => !Array.isArray(s[0]) || isOk(s[0])).map(s => Array.isArray(s[0]) ? s.slice(1) : s)
})

 
const getStop = arr => {
     const curTime = new getOffsetTime()
     for (let i = 0; i < arr.length - 1; i++) {
 
         if (arr[i] === '-') continue;
 
         const stopTime = new getOffsetTime()
         const nextStopTime = new getOffsetTime()
         stopTime.setHours(...arr[i].split(':'))
         nextStopTime.setHours(...(arr[i + 1] === '-' ? arr[i + 2] : arr[i + 1]).split(':'))
 
         if (curTime > stopTime && curTime < nextStopTime) {
             return i;
         }
     }
     return null
}
 
 const createHtmlForecast = (destination, direction, routeNumber) => {

console.log(destination, direction, routeNumber)

    const backStops = riverSchedule[direction].stops.back;
    const start = backStops[destination === 'straight' ? backStops.length-1 : 0]
    const finish = backStops[destination === 'straight' ? 0 : backStops.length-1]

    const title = `Речной трамвай<br><b>${start} - ${finish}</b>`
    const stops = riverSchedule[direction].stops[destination]
    const time = riverSchedule[direction][destination][routeNumber]
 
     let result = `<table><tbody><tr><td colspan="2" align="center">${title}</td></tr>
 <tr><td colspan="2" align="center"><hr><i><b>Прогноз прохождения</b></i></td></tr>`
 
     stops.map((s, i) => {
         result += `<tr><td>${s}</td><td align="right">${time[i]}</td></tr>`
     })
 
     result += '</tbody></table>'
     return result
 
 }
 
 const createHtmlSchedule = type => {
     const schedule = riverSchedule[type]
     const start = schedule.stops.back[schedule.stops.back.length - 1]
     const finish = schedule.stops.back[0]
     const callbacks = []
     let destNumber = 1;
 
     let result = `<table border="1" cellspacing="0"><tbody>
 <tr><td colspan="3" align="center"><b>Речной трамвай</b><h3>${start} - ${finish}</h3></td></tr>
 <tr align="center"><td colspan="3"><h3>Прямое направление<br></h3></td></tr>
 <tr align="center"><td><b>Марш</b></td><td><b>Текущая остановка</b></td><td><b>Вр.ост.</b></td></tr>`
 
     schedule.straight.map((arr, i) => {
         const stop = getStop(arr)
         const stopTime = stop !== null ? `<b>${arr[stop]}</b>` : arr[0]
 
         if (stop !== null) {
             callbacks.push([destNumber, ['river', type, 'straight', i].join(':')])
         }
 
         result += `<tr ${stop === null ? 'class=\'waiting\'':''} align="center">
                    <td><b>${stop !== null ? destNumber++ : '-'}</b></td>
                    <td><b>${schedule.stops.straight[stop || 0]}</b></td>
                    <td><b>${stopTime}</b></td>
                    </tr>`
     })
 
 
     result += `<tr align="center"><td colspan="3"><h3>Обратное направление<br></h3></td></tr>
 <tr align="center"><td><b>Марш.</b></td><td><b>Текущая остановка</b></td><td><b>Вр.ост.</b></td></tr>`
 
     schedule.back.map((arr, i) => {
         const stop = getStop(arr)
         const stopTime = stop !== null ? `<b>${arr[stop]}</b>` : arr[0]
 
         if (stop !== null) {
             callbacks.push([destNumber, ['river', type, 'back', i].join(':')])
         }
 
         result += `<tr ${stop === null ? 'class=\'waiting\'':''} align="center">
                    <td><b>${stop !== null ? destNumber++ : '-'}</b></td>
                    <td><b>${schedule.stops.back[stop || 0]}</b></td>
                    <td>${stopTime}</b></td>
                    </tr>`
     })
 
     result += '</tbody></table>'
     return {
         html: result,
         callbacks: callbacks
     }
 }

 const isRiverTransport = str => riverSchedule.hasOwnProperty(str)
 const getDirections = () => Object.keys(riverSchedule)

 module.exports = { createHtmlSchedule, createHtmlForecast, isRiverTransport, getDirections }
 
