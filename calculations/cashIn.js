const { getCoefficient, roundFee } = require('../helper');

function cashIn(opInfo, cfg) {
  let fee = 0;
  fee = opInfo.operation.amount * getCoefficient(cfg.percents);
  if (fee > cfg.max.amount) fee = cfg.max.amount;
  console.log(roundFee(fee));
}

module.exports = {
  cashIn,
};
