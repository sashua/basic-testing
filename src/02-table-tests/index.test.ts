// Uncomment the code below and write your tests
import { Action, simpleCalculator } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: -3, b: 4, action: Action.Subtract, expected: -7 },
  { a: 5, b: -6, action: Action.Multiply, expected: -30 },
  { a: -7, b: -8, action: Action.Divide, expected: -7 / -8 },
  { a: 9, b: 10, action: Action.Exponentiate, expected: 9 ** 10 },
  { a: 11, b: 12, action: '???', expected: null },
  { a: undefined, b: null, action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should calculate [$a $action $b = $expected]',
    ({ expected, ...input }) => {
      expect(simpleCalculator(input)).toBe(expected);
    },
  );
});
