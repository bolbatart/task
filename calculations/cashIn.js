const { getCommission } = require('../helper');

function cashIn(opInfo, cfg) {
  let fee = 0;
  fee = opInfo.operation.amount * getCommission(cfg.percents);
  if (fee > cfg.max.amount) fee = cfg.max.amount;
  console.log(fee.toFixed(2));
}

module.exports = {
  cashIn,
};
