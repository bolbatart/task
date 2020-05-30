/* eslint-disable */
const fetch = require('node-fetch');
const { cashOutNatural, cashOutLegal } = require('./cashOut');

describe('get a cash out fee for a natural person', () => {
  let cfg;

  beforeAll(async () => {
    cfg = await fetch(
      'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural'
    ).then((value) => value.json());
    console.log = jest.fn();
  });

  test('get 87.00 EUR as a fee for 30000.00 EUR cash out', () => {
    const operationInfo = {
      date: '2020-05-29',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_out',
      operation: {
        amount: 30000,
        currency: 'EUR',
      },
    };

    cashOutNatural(operationInfo, cfg);
    expect(console.log).toHaveBeenCalledWith('87.00');
  });

  test('get 0.30 EUR as a fee for 100.00 EUR cash out after 30000.00 EUR cash out', () => {
    const operationInfo = {
      date: '2020-05-29',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_out',
      operation: {
        amount: 100,
        currency: 'EUR',
      },
    };
    cashOutNatural(operationInfo, cfg);
    expect(console.log).toHaveBeenCalledWith('0.30');
  });

  test('get 0.00 EUR as a fee for 100.00 EUR cash out after all previous week cash outs', () => {
    const operationInfo = {
      date: '2020-06-03',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_out',
      operation: { amount: 100, currency: 'EUR' },
    };

    cashOutNatural(operationInfo, cfg);
    expect(console.log).toHaveBeenCalledWith('0.00');
  });
});

describe('get a cash out fee for a legal person', () => {
  let cfg;

  beforeAll(async () => {
    cfg = await fetch(
      'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical'
    ).then((value) => value.json());
    console.log = jest.fn();
  });

  test('get 0.90 EUR as a fee for 300.00 EUR cash out', () => {
    const operationInfo = {
      date: '2020-05-29',
      user_id: 2,
      user_type: 'juridical',
      type: 'cash_out',
      operation: { amount: 300.0, currency: 'EUR' },
    };

    cashOutLegal(operationInfo, cfg);
    expect(console.log).toHaveBeenCalledWith('0.90');
  });

  test('get 0.50 EUR as a fee for 1.00 EUR cash out', () => {
    const operationInfo = {
      date: '2020-05-29',
      user_id: 2,
      user_type: 'juridical',
      type: 'cash_out',
      operation: { amount: 1.0, currency: 'EUR' },
    };

    cashOutLegal(operationInfo, cfg);
    expect(console.log).toHaveBeenCalledWith('0.50');
  });
});
