// Uncomment the code below and write your tests
import { Action, simpleCalculator } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    expect(simpleCalculator({ a: 1, b: 2, action: Action.Add })).toBe(3);
  });

  test('should subtract two numbers', () => {
    expect(simpleCalculator({ a: -3, b: 4, action: Action.Subtract })).toBe(-7);
  });

  test('should multiply two numbers', () => {
    expect(simpleCalculator({ a: 5, b: -6, action: Action.Multiply })).toBe(
      -30,
    );
  });

  test('should divide two numbers', () => {
    expect(simpleCalculator({ a: -7, b: -8, action: Action.Divide })).toBe(
      -7 / -8,
    );
  });

  test('should exponentiate two numbers', () => {
    expect(simpleCalculator({ a: 9, b: 10, action: Action.Exponentiate })).toBe(
      9 ** 10,
    );
  });

  test('should return null for invalid action', () => {
    expect(simpleCalculator({ a: 11, b: 12, action: '???' })).toBe(null);
  });

  test('should return null for invalid arguments', () => {
    expect(
      simpleCalculator({ a: undefined, b: null, action: Action.Add }),
    ).toBe(null);
  });
});
