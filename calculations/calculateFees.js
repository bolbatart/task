const { cashIn } = require('./cashIn');
const { cashOutNatural, cashOutLegal } = require('./cashOut');

async function calculateFees(
  operations,
  cashInConf,
  cashOutNaturalConf,
  cashOutLegalConf
) {
  operations.forEach((opInfo) => {
    if (opInfo.operation.currency !== 'EUR')
      throw new Error('Only EUR currency allowed');
    switch (opInfo.type) {
      case 'cash_in':
        cashIn(opInfo, cashInConf);
        break;
      case 'cash_out':
        if (opInfo.user_type === 'natural')
          cashOutNatural(opInfo, cashOutNaturalConf);
        if (opInfo.user_type === 'juridical')
          cashOutLegal(opInfo, cashOutLegalConf);
        break;
      default:
        break;
    }
  });
}

module.exports = {
  calculateFees,
};
