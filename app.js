const fileName = process.argv.slice(2)[0];
const fs = require('fs');
const fetch = require("node-fetch");

const rawdata = fs.readFileSync(fileName);
const data = JSON.parse(rawdata);
const getUpcomingSunday = require('./helper/getUpcomingSunday').getUpcomingSunday

let cashInConf
let cashOutNaturalConf
let cashOutLegalConf
let database = []

async function getData() {
  try {
    const cashInConfRes = await fetch('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in')
    const cashOutNaturalConfRes = await fetch('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural')
    const cashOutLegalConfRes = await fetch('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical')
    cashInConf = await cashInConfRes.json()
    cashOutNaturalConf = await cashOutNaturalConfRes.json()
    cashOutLegalConf = await cashOutLegalConfRes.json()
  } catch (err) {
    console.log(err)
  }
}


async function calculateFees() {
  await getData()
  data.forEach(opInfo => {
    try {
      if(opInfo.operation.currency !== 'EUR') throw 'Only EUR currency allowed'
      switch (opInfo.type) {
        case 'cash_in':
            cashIn(opInfo)
          break;
        case 'cash_out':
            if (opInfo.user_type === 'natural') cashOutNatural(opInfo)
            if (opInfo.user_type === 'juridical') cashOutLegal(opInfo) 
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error)
    }
  });  
}


function cashIn(opInfo) {
  let fee = 0
  fee = opInfo.operation.amount * cashInConf.percents / 100
  if(fee > 5) fee = 5
  console.log(fee)
}


function cashOutNatural(opInfo) {
  let fee = 0
  let user = database.find(obj => obj.user_id === opInfo.user_id)
  
  if (user){
    let expires = new Date(user.expires)
    let opDate = new Date(opInfo.date)
    
    if (expires >= opDate) {
      if (user.total_amount > cashOutNaturalConf.week_limit.amount) 
        fee = opInfo.operation.amount * cashOutNaturalConf.percents / 100
      else if (user.total_amount + opInfo.operation.amount > cashOutNaturalConf.week_limit.amount) 
        fee = (user.total_amount + opInfo.operation.amount - cashOutNaturalConf.week_limit.amount) * cashOutNaturalConf.percents / 100
      else 
        fee = (user.total_amount + opInfo.operation.amount) * cashOutNaturalConf.percents / 100
    } 
    else {
      user.total_amount = opInfo.operation.amount
      user.expires = getUpcomingSunday(opInfo.date)
      if (user.total_amount <= cashOutNaturalConf.week_limit.amount)
        fee = 0
      else
        fee = (opInfo.operation.amount - cashOutNaturalConf.week_limit.amount) * cashOutNaturalConf.percents / 100
    }
  }
  else {
    user = { user_id: opInfo.user_id, total_amount: opInfo.operation.amount, expires: getUpcomingSunday(opInfo.date) }
    user.total_amount < cashOutNaturalConf.week_limit.amount ? fee = 0 : fee = opInfo.operation.amount * cashOutNaturalConf.percents / 100
    database.push(user)
    if (user.total_amount <= cashOutNaturalConf.week_limit.amount)
      fee = 0
    else
      fee = (opInfo.operation.amount - cashOutNaturalConf.week_limit.amount) * cashOutNaturalConf.percents / 100
  }
  console.log(fee)
}


function cashOutLegal(opInfo) {
  let fee = opInfo.operation.amount * cashOutLegalConf.percents / 100
  if(fee < cashOutLegalConf.min.amount) fee = cashOutLegalConf.min.amount
  console.log(fee)
}




calculateFees()
