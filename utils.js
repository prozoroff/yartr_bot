const inRow = (arr, rowLength) => {
    const result = []
    let item, row = []
    while (item = arr.shift()) {
      if (row.length === rowLength) {
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

module.exports = { inRow }
