// 判断入参是否为时间对象
function isDate(date) {
  if(!date){
    return new Date();
  }
  if(date && date.getMonth){
    return date;
  }
  if(typeof date === 'string'){
    const $ = date.indexOf('-') > -1 ? '-' : '/';
    const dateArr = date.split($);
    if(!dateArr[2]) return new Date();
    return new Date(dateArr[0],dateArr[1] - 1,dateArr[2]);
  }
};

// 判断是否为闰年
function isLeapYear(year) {
  const Y = parseInt(year);
  if ((Y % 4 == 0 && Y % 100 != 0) || (Y % 400 == 0)) return true;
  return false;
};

// 获取传入时间的当月天数
function getDaysOfMonth(d) {
  return [31, isLeapYear(d.year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][d.month];
}

// 获取当月从周几开始
function getBeginDayOfMouth(d) {
  return new Date(d.year, d.month, 1).getDay();
}

// 获取当月信息
function getDisplayInfo(time) {
  const date = isDate(time);
  const d = {
    year: date.getFullYear(),
    month: date.getMonth()
  }

  //这个月一共多少天
  const days = getDaysOfMonth(d);

  //这个月是星期几开始的
  const beginWeek = getBeginDayOfMouth(d);

  return {
    year: d.year,
    month: d.month,
    days: days,
    beginWeek: beginWeek
  }
}

// 获取显示日期
function getDisplayDays(time){
  const info = getDisplayInfo(time);
  let { year, month, days, beginWeek } = info;
  const dayArr = []
  // 需要添加的日期
  let len = days + beginWeek + (7 - (days + beginWeek) % 7);
  for(let i = 0; i < len; i++){
    let day = i - beginWeek + 1;
    
    // 重置时间
    let Y = new Date(year, month, day).getFullYear();
    let M = new Date(year, month, day).getMonth();
    let D = new Date(year, month, day).getDate();
    let T = new Date(year, month, day).getTime();
    dayArr.push({ year: Y, month: M, day: D, time: T })
  }
  return dayArr;
}
export default { getDisplayInfo, getDisplayDays };