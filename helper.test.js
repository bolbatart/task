/* eslint-disable */
const { getCommission, getUpcomingSunday } = require('./helper');

test('convert 1% into coefficient which is 0.01', () => {
  expect(getCommission(1)).toBe(0.01);
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
