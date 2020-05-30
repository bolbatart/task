/* eslint-disable */
const fetch = require('node-fetch');
const { cashIn } = require('./cashIn');

let cfg;
beforeAll(async () => {
  cfg = await fetch(
    'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in'
  ).then((value) => value.json());
  console.log = jest.fn();
});

describe('get a cash in fee which is less than 5.00 EUR', () => {
  test('get the 0.06 EUR as a fee for 200.00 EUR cash in', () => {
    const operation_info = {
      date: '2016-01-05',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_in',
      operation: { amount: 200.0, currency: 'EUR' },
    };

    cashIn(operation_info, cfg);
    expect(console.log).toHaveBeenCalledWith('0.06');
  });

  test('get the 5.00 EUR as a fee for 100000.00 EUR cash in', () => {
    const operation_info = {
      date: '2016-01-05',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_in',
      operation: { amount: 100000.0, currency: 'EUR' },
    };

    cashIn(operation_info, cfg);
    expect(console.log).toHaveBeenCalledWith('5.00');
  });
});

test('get the max cash in fee', () => {
  const operation_info = {
    date: '2016-01-05',
    user_id: 1,
    user_type: 'natural',
    type: 'cash_in',
    operation: { amount: 1000000.0, currency: 'EUR' },
  };

  cashIn(operation_info, cfg);
  expect(console.log).toHaveBeenCalledWith('5.00');
});
