/* eslint-disable */
const { getCoefficient, getUpcomingSunday, roundFee } = require('./helper');

test('convert 1% into coefficient which is 0.01', () => {
  expect(getCoefficient(1)).toBe(0.01);
});

test('get the upcoming sunday of 2020-05-30', () => {
  expect(getUpcomingSunday('2020-05-30')).toBe('2020-05-31');
});

test('get the upcoming sunday of 2020-06-01', () => {
  expect(getUpcomingSunday('2020-06-01')).toBe('2020-06-07');
});

test('get the upcoming sunday of 2020-06-01', () => {
  expect(getUpcomingSunday('2020-06-01')).not.toBe('2020-05-31');
});

test('0.023 EUR should be rounded to 3 Euro cents', () => {
  expect(roundFee(0.023)).toBe('0.03');
});

test('0.0023 EUR should be rounded to 1 Euro cents', () => {
  expect(roundFee(0.0023)).toBe('0.01');
});
