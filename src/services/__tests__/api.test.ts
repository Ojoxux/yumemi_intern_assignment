import axios, { AxiosInstance, AxiosError } from 'axios';
import * as apiModule from '../api';
import { fetchPrefectures, fetchPopulation } from '../api';

jest.mock('axios');

describe('API関数', () => {
  let mockApi: jest.Mocked<AxiosInstance>;
  let mockAxiosCreate: jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    jest.clearAllMocks();
    mockApi = {
      get: jest.fn(),
      defaults: {
        baseURL: 'https://opendata.resas-portal.go.jp',
        headers: { 'X-API-KEY': 'test-api-key' }
      }
    } as any;
    mockAxiosCreate = jest.fn().mockReturnValue(mockApi);
    (axios.create as jest.Mock) = mockAxiosCreate;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    originalEnv = process.env;
    process.env = { ...originalEnv, VITE_REACT_APP_RESAS_API_KEY: 'test-api-key' };

    apiModule.initializeApi();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    process.env = originalEnv;
  });

  describe('createApi', () => {
    it('APIキーが設定されている場合、正しい設定でAxiosインスタンスを作成する', () => {
      const result = apiModule.createApi(mockAxiosCreate);
      expect(mockAxiosCreate).toHaveBeenCalledWith({
        baseURL: 'https://opendata.resas-portal.go.jp',
        headers: { 'X-API-KEY': 'test-api-key' },
      });
      expect(result).toBe(mockApi);
    });

    it('APIキーが設定されていない場合、空文字列をAPIキーとして使用する', () => {
      delete process.env.VITE_REACT_APP_RESAS_API_KEY;
      const result = apiModule.createApi(mockAxiosCreate);
      expect(mockAxiosCreate).toHaveBeenCalledWith({
        baseURL: 'https://opendata.resas-portal.go.jp',
        headers: { 'X-API-KEY': '' },
      });
      expect(result).toBe(mockApi);
    });

    it('axios.createがエラーをスローした場合のハンドリング', () => {
        mockAxiosCreate.mockImplementation(() => {
          throw new Error('axios create error');
        });
        expect(() => apiModule.createApi(mockAxiosCreate)).toThrow('axios create error');
      });
  });

  describe('api instance', () => {
    it('デフォルトのapiインスタンスが正しく作成される', () => {
      const testApi = apiModule.createApi(mockAxiosCreate);
      expect(testApi).toBeDefined();
      expect(testApi.defaults.baseURL).toBe('https://opendata.resas-portal.go.jp');
      expect(testApi.defaults.headers['X-API-KEY']).toBe('test-api-key');
    });

    it('エクスポートされたapiインスタンスが存在する', () => {
      expect(apiModule.api).toBeDefined();
      expect(apiModule.api.defaults.baseURL).toBe('https://opendata.resas-portal.go.jp');
      expect(apiModule.api.defaults.headers['X-API-KEY']).toBeDefined();
    });
  });

  describe('fetchPrefectures', () => {
    it('データを正常に取得する', async () => {
      const mockData = { data: { result: [{ prefCode: 1, prefName: '北海道' }] } };
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchPrefectures(mockApi);
      expect(result).toEqual(mockData.data.result);
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/prefectures');
    });

    it('APIエラーを適切に処理する', async () => {
      const mockError = new Error('APIエラー') as AxiosError;
      mockApi.get.mockRejectedValue(mockError);

      await expect(fetchPrefectures(mockApi)).rejects.toThrow('APIエラー');
      expect(consoleErrorSpy).toHaveBeenCalledWith('都道府県データの取得に失敗しました:', mockError);
    });

    it('空のレスポンスを適切に処理する', async () => {
      const mockData = { data: { result: [] } };
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchPrefectures(mockApi);
      expect(result).toEqual([]);
    });

    it('ネットワークエラーを適切に処理する', async () => {
      const mockError = new Error('Network Error') as AxiosError;
      mockError.isAxiosError = true;
      mockError.response = undefined;
      mockApi.get.mockRejectedValue(mockError);

      await expect(fetchPrefectures(mockApi)).rejects.toThrow('Network Error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('都道府県データの取得に失敗しました:', mockError);
    });

    it('APIレスポンスが期待される形式でない場合にエラーを処理する', async () => {
      const mockData = { data: { unexpected: 'format' } };
      mockApi.get.mockResolvedValue(mockData);

      await expect(fetchPrefectures(mockApi)).rejects.toThrow('Unexpected API response format');
      expect(consoleErrorSpy).toHaveBeenCalledWith('都道府県データの取得に失敗しました:', expect.any(Error));
    });

    it('APIレスポンスのresultプロパティが配列でない場合にエラーを処理する', async () => {
      const mockData = { data: { result: 'not an array' } };
      mockApi.get.mockResolvedValue(mockData);

      await expect(fetchPrefectures(mockApi)).rejects.toThrow('Unexpected API response format');
      expect(consoleErrorSpy).toHaveBeenCalledWith('都道府県データの取得に失敗しました:', expect.any(Error));
    });

    it('APIレスポンスにresultプロパティがない場合、エラーをスローする', async () => {
      const mockResponse = { data: {} };
      mockApi.get.mockResolvedValue(mockResponse);

      await expect(apiModule.fetchPrefectures(mockApi)).rejects.toThrow('Unexpected API response format');
    });
  });

  describe('fetchPopulation', () => {
    it('データを正常に取得する', async () => {
      const mockData = { data: { result: { data: [{ year: 2020, value: 5000000 }] } } };
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchPopulation(1, mockApi);
      expect(result).toEqual(mockData.data.result.data);
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/population/composition/perYear', {
        params: { prefCode: 1, cityCode: '-' },
      });
    });

    it('APIエラーを適切に処理する', async () => {
      const mockError = new Error('APIエラー') as AxiosError;
      mockApi.get.mockRejectedValue(mockError);

      await expect(fetchPopulation(1, mockApi)).rejects.toThrow('APIエラー');
      expect(consoleErrorSpy).toHaveBeenCalledWith('人口データの取得に失敗しました:', mockError);
    });

    it('無効なprefCodeでエラーを投げる', async () => {
      await expect(fetchPopulation(-1, mockApi)).rejects.toThrow('Invalid prefCode');
      await expect(fetchPopulation(0, mockApi)).rejects.toThrow('Invalid prefCode');
      await expect(fetchPopulation(48, mockApi)).rejects.toThrow('Invalid prefCode');
    });

    it('空のデータを適切に処理する', async () => {
      const mockData = { data: { result: { data: [] } } };
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchPopulation(1, mockApi);
      expect(result).toEqual([]);
    });

    it('prefCodeが境界値（1と47）の場合、正常に動作する', async () => {
      const mockData = { data: { result: { data: [{ year: 2020, value: 5000000 }] } } };
      mockApi.get.mockResolvedValue(mockData);

      await expect(apiModule.fetchPopulation(1, mockApi)).resolves.toEqual(mockData.data.result.data);
      await expect(apiModule.fetchPopulation(47, mockApi)).resolves.toEqual(mockData.data.result.data);
    });

    it('prefCodeが整数でない場合、エラーをスローする', async () => {
      await expect(apiModule.fetchPopulation(1.5, mockApi)).rejects.toThrow('Invalid prefCode');
      await expect(apiModule.fetchPopulation(NaN, mockApi)).rejects.toThrow('Invalid prefCode');
      await expect(apiModule.fetchPopulation(Infinity, mockApi)).rejects.toThrow('Invalid prefCode');
      await expect(fetchPopulation('1' as any, mockApi)).rejects.toThrow('Invalid prefCode');
    });

    it('ネットワークエラーを適切に処理する', async () => {
      const mockError = new Error('Network Error') as AxiosError;
      mockError.isAxiosError = true;
      mockError.response = undefined;
      mockApi.get.mockRejectedValue(mockError);

      await expect(fetchPopulation(1, mockApi)).rejects.toThrow('Network Error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('人口データの取得に失敗しました:', mockError);
    });

    it('APIレスポンスが期待される形式でない場合にエラーを処理する', async () => {
      const mockData = { data: { result: 'unexpected format' } };
      mockApi.get.mockResolvedValue(mockData);

      await expect(fetchPopulation(1, mockApi)).rejects.toThrow('Unexpected API response format');
      expect(consoleErrorSpy).toHaveBeenCalledWith('人口データの取得に失敗しました:', expect.any(Error));
    });

    it('APIレスポンスにdataプロパティがない場合、エラーをスローする', async () => {
      const mockResponse = {};
      mockApi.get.mockResolvedValue(mockResponse);

      await expect(apiModule.fetchPopulation(1, mockApi)).rejects.toThrow('Unexpected API response format');
      expect(consoleErrorSpy).toHaveBeenCalledWith('人口データの取得に失敗しました:', expect.any(Error));
    });

    it('APIレスポンスのdata.result.dataが存在しない場合にエラーを処理する', async () => {
      const mockData = { data: { result: {} } };
      mockApi.get.mockResolvedValue(mockData);

      await expect(fetchPopulation(1, mockApi)).rejects.toThrow('Unexpected API response format');
      expect(consoleErrorSpy).toHaveBeenCalledWith('人口データの取得に失敗しました:', expect.any(Error));
    });

    it('APIレスポンスのdata.resultが配列の場合、エラーをスローする', async () => {
      const mockResponse = { data: { result: [] } };
      mockApi.get.mockResolvedValue(mockResponse);

      await expect(apiModule.fetchPopulation(1, mockApi)).rejects.toThrow('Unexpected API response format');
      expect(consoleErrorSpy).toHaveBeenCalledWith('人口データの取得に失敗しました:', expect.any(Error));
    });

    it('APIレスポンスのdata.result.dataが存在するが配列でない場合、エラーをスローする', async () => {
      const mockResponse = { data: { result: { data: {} } } };
      mockApi.get.mockResolvedValue(mockResponse);

      await expect(apiModule.fetchPopulation(1, mockApi)).rejects.toThrow('Unexpected API response format');
      expect(consoleErrorSpy).toHaveBeenCalledWith('人口データの取得に失敗しました:', expect.any(Error));
    });
  });

  describe('API initialization', () => {
    it('initializes API when NODE_ENV is not test', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      jest.isolateModules(() => {
        const apiModule = require('../api');
        expect(apiModule.api).toBeDefined();
      });

      process.env.NODE_ENV = originalNodeEnv;
    });

    it('does not initialize API when NODE_ENV is test', () => {
      jest.isolateModules(() => {
        const apiModule = require('../api');
        expect(apiModule.api).toBeUndefined();
      });
    });

    it('initializeApi function creates and assigns api instance', () => {
      apiModule.initializeApi();
      expect(apiModule.api).toBeDefined();
      expect(mockAxiosCreate).toHaveBeenCalledWith({
        baseURL: 'https://opendata.resas-portal.go.jp',
        headers: { 'X-API-KEY': 'test-api-key' },
      });
    });
  });
});