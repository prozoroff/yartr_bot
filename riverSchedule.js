const riverSchedule = {
	'вакарево': {
		'stops': {
			'straight': [
				'Ярославль',
				'Порт',
				'Парково',
				'Дядьково',
				'Кировские лагеря',
				'улица Спортивная',
				'Вакарево'
			],
			'back': [
				'Вакарево',
				'улица Спортивная',
				'Кировские лагеря',
				'Дядьково',
				'Парково',
				'Порт',
				'Ярославль'
			]
		},
		'straight': [
			[
				'07:30',
				'07:45',
				'07:50',
				'08:00',
				'08:05',
				'08:10',
				'08:15'
			],
			[
				'11:30',
				'11:45',
				'11:50',
				'12:00',
				'12:05',
				'12:10',
				'12:15'
			],
			[
				'15:35',
				'15:50',
				'15:55',
				'16:05',
				'16:10',
				'16:15',
				'16:20'
			],
			[
				'18:15',
				'18:30',
				'-',
				'18:40',
				'-',
				'18:45',
				'18:50'
			],
			[
				'20:00',
				'20:15',
				'20:20',
				'20:30',
				'20:35',
				'20:40',
				'20:45'
			]
		],
		'back': [
			[
				'08:25',
				'08:30',
				'08:35',
				'08:40',
				'08:50',
				'08:55',
				'09:10'
			],
			[
				'12:25',
				'12:30',
				'12:35',
				'12:40',
				'12:50',
				'12:55',
				'13:10'
			],
			[
				'16:35',
				'16:40',
				'16:45',
				'16:50',
				'17:00',
				'17:05',
				'17:20'
			],
			[
				'19:00',
				'19:05',
				'-',
				'19:15',
				'-',
				'19:25',
				'19:40'
			],
			[
				'21:00',
				'21:05',
				'21:10',
				'21:15',
				'21:25',
				'21:30',
				'21:45'
			]
		]
	},
	'толга': {
		'stops': {
			'straight': [
				'Речной вокзал, причал №8',
				'Верхний остров',
				'Свободный труд',
				'Долматово',
				'Иваньково, ул. Елены Колесовой',
				'Толга',
			],
			'back': [
				'Толга',
				'Иваньково, ул. Елены Колесовой',
				'Долматово',
				'Свободный труд',
				'Верхний остров',
				'Речной вокзал',
			]
		},
		'straight': [
			[
				'09:20',
				'09:35',
				'09:40',
				'09:50',
				'10:10',
				'10:15'
			],
			[
				'13:30',
				'13:45',
				'13:50',
				'14:00',
				'14:20',
				'14:25'
			],
			[
				'17:30',
				'17:45',
				'17:50',
				'18:00',
				'18:15',
				'18:20'
			],
			[
				'19:35',
				'19:50',
				'19:55',
				'20:00',
				'20:15',
				'20:20'
			],
			[
				'21:25',
				'21:40',
				'21:45',
				'21:50',
				'22:05',
				'22:10'
			]
		],
		'back': [
			[
				'10:30',
				'10:35',
				'10:50',
				'10:55',
				'11:00',
				'11:15'
			],
			[
				'14:35',
				'14:40',
				'14:55',
				'15:05',
				'15:10',
				'15:25'
			],
			[
				'18:30',
				'18:35',
				'18:50',
				'19:00',
				'19:10',
				'19:25'
			],
			[
				'20:30',
				'20:35',
				'20:50',
				'20:55',
				'21:00',
				'21:15'
			],
			[
				'22:20',
				'22:25',
				'22:40',
				'22:45',
				'22:50',
				'23:05'
			]
		]
	}
}


const getStop = arr => {
	const curTime = new Date()
	for (let i = 0; i < arr.length - 1; i++) {

		if (arr[i] === '-') continue;

		const stopTime = new Date()
		const nextStopTime = new Date()
		stopTime.setHours(...arr[i].split(':'))
		nextStopTime.setHours(...(arr[i + 1] === '-' ? arr[i + 2] : arr[i + 1]).split(':'))

		if (curTime > stopTime && curTime < nextStopTime) {
			return i;
		}
	}
	return 0
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

	let result = `<h2>Речной трамвай ${start} - ${finish}</h2>
<table border="1" cellspacing="0"><tbody>
<tr align="center"><td colspan="3"><h3>Прямое направление<br></h3></td></tr>
<tr align="center"><td><b>Марш.</b></td><td><b>Текущая остановка</b></td><td><b>Вр.ост.</b></td></tr>`

	schedule.straight.map((arr, i) => {
		const curTime = new Date()
		const stop = getStop(arr)
		const stopTime = stop > 0 ? arr[stop] : (curTime.getHours() + ':' + curTime.getMinutes())
		const title = `Речной трамвай<br><b>${start} - ${finish}</b>`

		if (stop > 0) {
			callbacks.push([destNumber, createHtmlForecast(title, schedule.stops.scright, arr)])
		}

		result += `<tr align="center"><td><b>${stop > 0 ? destNumber++ : ''}</b></td><td><b>${schedule.stops.straight[stop]}</b></td><td><b>${stopTime}</b></td></tr>`
	})


	result += `<tr align="center"><td colspan="3"><h3>Обратное направление<br></h3></td></tr>
<tr align="center"><td><b>Марш.</b></td><td><b>Текущая остановка</b></td><td><b>Вр.ост.</b></td></tr>`

	schedule.back.map((arr, i) => {
		const curTime = new Date()
		const stop = getStop(arr)
		const stopTime = stop > 0 ? arr[stop] : (curTime.getHours() + ':' + curTime.getMinutes())
		const title = `Речной трамвай<br><b>${finish} - ${start}</b>`

		if (stop > 0) {
			callbacks.push([destNumber, createHtmlForecast(title, schedule.stops.back, arr)])
		}

		result += `<tr align="center"><td><b>${stop > 0 ? destNumber++ : ''}</b></td><td><b>${schedule.stops.back[stop]}</b></td><td><b>${stopTime}</b></td></tr>`
	})

	result += '</tbody></table>'
	return {
		html: result,
		callbacks: callbacks
	}

}


module.exports = { riverSchedule, createHtmlSchedule }