export function getQueryParam(param) {
  const query = window.location.href.split('?')[1];
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split('=');
    if (pair[0] === param) {
      return pair[1];
    }
  }
  return false;
}

export function timeFormater(time) {
  const t = time ? new Date(time) : new Date();
  const Y = t.getFullYear();
  const M = t.getMonth();
  const D = t.getDate();
  const d = t.getDay();
  const h = t.getHours();
  const m = t.getMinutes();
  const s = t.getSeconds();
  const strM = M + 1 < 10 ? `0${M + 1}` : M;
  const strD = D < 10 ? `0${D}` : D;
  const strH = h < 10 ? `0${h}` : h;
  const strMm = m < 10 ? `0${m}` : m;
  const strS = s < 10 ? `0${s}` : s;
  return {
    Y,
    M,
    D,
    h,
    s,
    m,
    d,
    strM,
    strD,
    strH,
    strMm,
    strS,
  };
}

export function timeDelay(time) {
  const timeR = timeFormater(time);
  const timeC = timeFormater();
  return (
    parseInt(`${timeR.Y}${timeR.strM}${timeR.strD}`, 10) <
    parseInt(`${timeC.Y}${timeC.strM}${timeC.strD}`, 10)
  );
}