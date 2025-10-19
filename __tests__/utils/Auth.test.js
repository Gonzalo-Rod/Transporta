import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser, getToken, setUserSession, resetUserSession } from '../../utils/Auth';

describe('Auth utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns user value when stored', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('test-user');
    await expect(getUser()).resolves.toBe('test-user');
  });

  it('returns null when user is null or "undefined"', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    await expect(getUser()).resolves.toBeNull();

    AsyncStorage.getItem.mockResolvedValueOnce('undefined');
    await expect(getUser()).resolves.toBeNull();
  });

  it('returns null when getUser throws', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('failure'));
    await expect(getUser()).resolves.toBeNull();
  });

  it('returns token value when stored', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('token');
    await expect(getToken()).resolves.toBe('token');
  });

  it('returns null when getToken throws', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('failure'));
    await expect(getToken()).resolves.toBeNull();
  });

  it('sets user session', async () => {
    await setUserSession('user', 'token');
    expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(1, 'user', 'user');
    expect(AsyncStorage.setItem).toHaveBeenNthCalledWith(2, 'token', 'token');
  });

  it('resets user session', async () => {
    await resetUserSession();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('token');
  });
});
