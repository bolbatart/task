const fileName = process.argv.slice(2)[0];
const fs = require('fs');
const fetch = require('node-fetch');

const rawdata = fs.readFileSync(fileName);
const data = JSON.parse(rawdata);
const { calculateFees } = require('./calculations/calculateFees');

const urls = [
  'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in',
  'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural',
  'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical'
];

// async function calculateFees(
//   operations,
//   cashInConf,
//   cashOutNaturalConf,
//   cashOutLegalConf
// ) {
//   operations.forEach(opInfo => {
//     if (opInfo.operation.currency !== 'EUR')
//       throw new Error('Only EUR currency allowed');
//     switch (opInfo.type) {
//       case 'cash_in':
//         cashIn(opInfo, cashInConf);
//         break;
//       case 'cash_out':
//         if (opInfo.user_type === 'natural')
//           cashOutNatural(opInfo, cashOutNaturalConf);
//         if (opInfo.user_type === 'juridical')
//           cashOutLegal(opInfo, cashOutLegalConf);
//         break;
//       default:
//         break;
//     }
//   });
// }

// MAIN
Promise.all(
  urls.map(url => {
    return fetch(url).then(value => value.json());
  })
)
  .then(allResponses => {
    const cashInConf = allResponses[0];
    const cashOutNaturalConf = allResponses[1];
    const cashOutLegalConf = allResponses[2];

    calculateFees(data, cashInConf, cashOutNaturalConf, cashOutLegalConf);
  })
  .catch(err => console.log(err));
