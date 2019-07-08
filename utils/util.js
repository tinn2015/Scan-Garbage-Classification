const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatStringsNumber = function (string) {
  let stringObj = {}
  let stringArr = []
  let arr = string.split('')
  arr.forEach(i => {
    if (stringObj[i]) {
      stringObj[i] += 1
    } else {
      stringObj[i] = 1
    }
  })
  for (let i in stringObj) {
    stringArr.push({
      key: i,
      num: stringObj[i]
    })
  }
  stringArr.sort(function (a,b) {
    return b.num - a.num
  })
  console.log(stringArr, 'stringArr')
  return stringArr
}

module.exports = {
  formatTime: formatTime,
  formatStringsNumber: formatStringsNumber
}
