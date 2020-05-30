const { getCoefficient, getUpcomingSunday, roundFee } = require('../helper');

const database = []; // issivaizduokim, kad tai yra duombaze

function cashOutNatural(opInfo, cfg) {
  let fee = 0;
  let user = database.find((obj) => obj.user_id === opInfo.user_id);

  if (user) {
    const expires = new Date(user.expires);
    const opDate = new Date(opInfo.date);

    if (expires >= opDate) {
      if (user.total_amount > cfg.week_limit.amount)
        fee = opInfo.operation.amount * getCoefficient(cfg.percents);
      else if (
        user.total_amount + opInfo.operation.amount >
        cfg.week_limit.amount
      )
        fee =
          (user.total_amount +
            opInfo.operation.amount -
            cfg.week_limit.amount) *
          getCoefficient(cfg.percents);
      else
        fee =
          (user.total_amount + opInfo.operation.amount) *
          getCoefficient(cfg.percents);
    } else {
      user.total_amount = opInfo.operation.amount;
      user.expires = getUpcomingSunday(opInfo.date);
      if (user.total_amount <= cfg.week_limit.amount) fee = 0;
      else
        fee =
          (opInfo.operation.amount - cfg.week_limit.amount) *
          getCoefficient(cfg.percents);
    }
  } else {
    user = {
      user_id: opInfo.user_id,
      total_amount: opInfo.operation.amount,
      expires: getUpcomingSunday(opInfo.date),
    };
    database.push(user);
    if (user.total_amount <= cfg.week_limit.amount) fee = 0;
    else
      fee =
        (opInfo.operation.amount - cfg.week_limit.amount) *
        getCoefficient(cfg.percents);
  }
  console.log(roundFee(fee));
}

function cashOutLegal(opInfo, cfg) {
  let fee = opInfo.operation.amount * getCoefficient(cfg.percents);
  if (fee < cfg.min.amount) fee = cfg.min.amount;
  console.log(roundFee(fee));
}

module.exports = {
  cashOutNatural,
  cashOutLegal,
};
