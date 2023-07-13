// Uncomment the code below and write your tests
import { random } from 'lodash';
import {
  BankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
  getBankAccount,
} from '.';

jest.mock('lodash');

const mockRandom = jest.mocked(random);

describe('BankAccount', () => {
  let bankAccount: BankAccount;

  beforeEach(() => (bankAccount = getBankAccount(1000)));

  afterAll(() => {
    jest.unmock('lodash');
  });

  test('should create account with initial balance', () => {
    const newAccount = getBankAccount(1000);
    expect(newAccount).toBeInstanceOf(BankAccount);
    expect(newAccount.getBalance()).toBe(1000);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => bankAccount.withdraw(2000)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const toAccount = getBankAccount(0);
    expect(() => bankAccount.transfer(2000, toAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => bankAccount.transfer(500, bankAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    expect(bankAccount.deposit(1000).getBalance()).toBe(2000);
  });

  test('should withdraw money', () => {
    expect(bankAccount.withdraw(500).getBalance()).toBe(500);
  });

  test('should transfer money', () => {
    const toAccount = getBankAccount(0);
    bankAccount.transfer(250, toAccount);
    expect(bankAccount.getBalance()).toBe(750);
    expect(toAccount.getBalance()).toBe(250);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    mockRandom.mockReturnValueOnce(50);
    mockRandom.mockReturnValueOnce(1);
    await expect(bankAccount.fetchBalance()).resolves.toBe(50);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    mockRandom.mockReturnValueOnce(50);
    mockRandom.mockReturnValueOnce(1);
    await expect(bankAccount.synchronizeBalance()).resolves.toBeUndefined();
    expect(bankAccount.getBalance()).toBe(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    mockRandom.mockReturnValueOnce(50);
    mockRandom.mockReturnValueOnce(0);
    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
