// 全局过滤器

// 日期补零
export const fillZero = (d) => {
  return d < 10 ? '0' + d : '' + d
}

// 格式化日期
export const formatDate = (timeStamp) => {
  const d = new Date(timeStamp)

  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const date = d.getDate()
  const hour = d.getHours()
  const min = d.getMinutes()
  const sec = d.getSeconds()

  return `${year}-${fillZero(month)}-${fillZero(date)} ${fillZero(hour)}:${fillZero(min)}:${fillZero(sec)}`
}
