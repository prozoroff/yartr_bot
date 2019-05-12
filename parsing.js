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

const isEmptyPage = str => !str.includes('<td')
const extractContent = str => str.split('</body>')[0].split('<body>')[1]

module.exports = { routeRenderMiddlware, isEmptyPage, extractContent }