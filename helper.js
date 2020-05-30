function getUpcomingSunday(opDate) {
  const parts = opDate.split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  let date = new Date(y, m, d);
  const day = date.getDay();
  if (day !== 0) {
    date.setDate(date.getDate() + 7 - day);
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;
    date = `${yyyy}-${mm}-${dd}`;
    return date;
  }
  return opDate;
}

function getCoefficient(percent) {
  return percent / 100;
}

function roundFee(fee) {
  return (Math.ceil(fee * 100) / 100).toFixed(2);
}

module.exports = {
  getUpcomingSunday,
  getCoefficient,
  roundFee,
};
