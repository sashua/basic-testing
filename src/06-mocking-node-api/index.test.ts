// Uncomment the code below and write your tests
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';

jest.mock('fs/promises');
jest.mock('fs');
jest.mock('path');

const readFileMock = jest.mocked(readFile);
const existsSyncMock = jest.mocked(existsSync);
const joinMock = jest.mocked(join);

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const spySetTimeout = jest.spyOn(global, 'setTimeout');
    const callback = () => undefined;
    doStuffByTimeout(callback, 5000);
    expect(spySetTimeout).toHaveBeenCalledTimes(1);
    expect(spySetTimeout).toHaveBeenCalledWith(callback, 5000);
    spySetTimeout.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 5000);
    jest.advanceTimersByTime(4999);
    expect(callback).toBeCalledTimes(0);
    jest.advanceTimersByTime(1);
    expect(callback).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const spySetInterval = jest.spyOn(global, 'setInterval');
    const callback = () => undefined;
    doStuffByInterval(callback, 5000);
    expect(spySetInterval).toHaveBeenCalledTimes(1);
    expect(spySetInterval).toHaveBeenCalledWith(callback, 5000);
    spySetInterval.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 5000);
    for (let i = 0; i < 100; i++) {
      jest.advanceTimersByTime(4999);
      expect(callback).toBeCalledTimes(i);
      jest.advanceTimersByTime(1);
      expect(callback).toBeCalledTimes(i + 1);
    }
  });
});

describe('readFileAsynchronously', () => {
  const pathToFile = 'path/to.file';
  const fileContent = 'file content';

  afterAll(() => {
    jest.unmock('fs/promises');
    jest.unmock('fs');
    jest.unmock('path');
  });

  test('should call join with pathToFile', async () => {
    joinMock.mockReturnValueOnce(pathToFile);
    existsSyncMock.mockReturnValueOnce(false);
    readFileMock.mockResolvedValueOnce(fileContent);
    await readFileAsynchronously(pathToFile);
    expect(joinMock).toBeCalledTimes(1);
    expect(joinMock.mock.lastCall?.includes(pathToFile)).toBeTruthy();
  });

  test('should return null if file does not exist', async () => {
    joinMock.mockReturnValueOnce(pathToFile);
    existsSyncMock.mockReturnValueOnce(false);
    readFileMock.mockResolvedValueOnce(fileContent);
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    joinMock.mockReturnValueOnce(pathToFile);
    existsSyncMock.mockReturnValueOnce(true);
    readFileMock.mockResolvedValueOnce(fileContent);
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBe(fileContent);
  });
});
