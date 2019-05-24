const riverSchedule = require('./riverSchedule')

function getOffsetTime () {
    var local = new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"});
    return new Date(local);
 }
 
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
 
 const createHtmlForecast = (title, stops, time) => {
 
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
 <tr><td colspan="3" align="center">Речной трамвай<h2>${start} - ${finish}</h2></td></tr>
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

 module.exports = { createHtmlSchedule, createHtmlForecast, isRiverTransport }
 