const formatTime = (time, option) => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const week = date.getDay()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  
  //获取 年月日
  if (option == 'YY-MM-DD') return [year, month, day].map(formatNumber).join('-')

  //获取 年月
  if (option == 'YY-MM') return [year, month].map(formatNumber).join('-')

  //获取 年
  if (option == 'YY') return [year].map(formatNumber).toString()

  //获取 月
  if (option == 'MM') return  [mont].map(formatNumber).toString()

  //获取 日
  if (option == 'DD') return [day].map(formatNumber).toString()

  //获取 年月日 周一 至 周日
  if (option == 'YY-MM-DD Week')  return [year, month, day].map(formatNumber).join('-') + ' ' + getWeek(week)

  //获取 月日 周一 至 周日
  if (option == 'MM-DD Week')  return [month, day].map(formatNumber).join('-') + ' ' + getWeek(week)

  //获取 周一 至 周日
  if (option == 'Week')  return getWeek(week)

  //获取 时分秒
  if (option == 'hh-mm-ss') return [hour, minute, second].map(formatNumber).join(':')

  //获取 时分
  if (option == 'hh-mm') return [hour, minute].map(formatNumber).join(':')

  //获取 分秒
  if (option == 'mm-dd') return [minute, second].map(formatNumber).join(':')

  //获取 时
  if (option == 'hh')  return [hour].map(formatNumber).toString()

  //获取 分
  if (option == 'mm')  return [minute].map(formatNumber).toString()

  //获取 秒
  if (option == 'ss') return [second].map(formatNumber).toString()

  //默认 时分秒 年月日
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = (time, option) => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const week = date.getDay()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  
  //获取 年月日
  if (option == 'YY-MM-DD') return [year, month, day].map(formatNumber).join('-')

  //获取 年月
  if (option == 'YY-MM') return [year, month].map(formatNumber).join('-')

  //获取 年
  if (option == 'YY') return [year].map(formatNumber).toString()

  //获取 月
  if (option == 'MM') return  [mont].map(formatNumber).toString()

  //获取 日
  if (option == 'DD') return [day].map(formatNumber).toString()

  //默认 时分秒 年月日
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getWeek = n => {
  switch(n) {
    case 1:
      return '星期一'
    case 2:
      return '星期二'
    case 3:
      return '星期三'
    case 4:
      return '星期四'
    case 5:
      return '星期五'
    case 6:
      return '星期六'
    case 7:
      return '星期日'
  }
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate
}