import axios, { AxiosInstance, AxiosError } from 'axios';
import * as apiModule from '../api';
import { fetchPrefectures, fetchPopulation } from '../api';

jest.mock('axios');

describe('API functions', () => {
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
    it('Uses an empty string if API key is undefined', () => {
      process.env.VITE_REACT_APP_RESAS_API_KEY = undefined;
      const result = apiModule.createApi(mockAxiosCreate);
      expect(mockAxiosCreate).toHaveBeenCalledWith({
        baseURL: 'https://opendata.resas-portal.go.jp',
        headers: { 'X-API-KEY': '' },
      });
      expect(result).toBe(mockApi);
    });

    it('Creates Axios instance with correct settings if API key is set', () => {
      const result = apiModule.createApi(mockAxiosCreate);
      expect(mockAxiosCreate).toHaveBeenCalledWith({
        baseURL: 'https://opendata.resas-portal.go.jp',
        headers: { 'X-API-KEY': 'test-api-key' },
      });
      expect(result).toBe(mockApi);
    });

    it('Uses an empty string as API key if not set', () => {
      delete process.env.VITE_REACT_APP_RESAS_API_KEY;
      const result = apiModule.createApi(mockAxiosCreate);
      expect(mockAxiosCreate).toHaveBeenCalledWith({
        baseURL: 'https://opendata.resas-portal.go.jp',
        headers: { 'X-API-KEY': '' },
      });
      expect(result).toBe(mockApi);
    });

    it('Handles error thrown by axios.create', () => {
        mockAxiosCreate.mockImplementation(() => {
          throw new Error('axios create error');
        });
        expect(() => apiModule.createApi(mockAxiosCreate)).toThrow('axios create error');
      });
  });

  describe('api instance', () => {
    it('Creates default api instance correctly', () => {
      const testApi = apiModule.createApi(mockAxiosCreate);
      expect(testApi).toBeDefined();
      expect(testApi.defaults.baseURL).toBe('https://opendata.resas-portal.go.jp');
      expect(testApi.defaults.headers['X-API-KEY']).toBe('test-api-key');
    });

    it('Exported api instance exists', () => {
      expect(apiModule.api).toBeDefined();
      expect(apiModule.api.defaults.baseURL).toBe('https://opendata.resas-portal.go.jp');
      expect(apiModule.api.defaults.headers['X-API-KEY']).toBeDefined();
    });
  });

  describe('fetchPrefectures', () => {
    it('Fetches data successfully', async () => {
      const mockData = { data: { result: [{ prefCode: 1, prefName: '北海道' }] } };
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchPrefectures(mockApi);
      expect(result).toEqual(mockData.data.result);
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/prefectures');
    });

    it('Handles API error correctly', async () => {
      const mockError = new Error('APIエラー') as AxiosError;
      mockApi.get.mockRejectedValue(mockError);

      await expect(fetchPrefectures(mockApi)).rejects.toThrow('APIエラー');
      expect(consoleErrorSpy).toHaveBeenCalledWith('都道府県データの取得に失敗しました:', mockError);
    });

    it('Handles empty response correctly', async () => {
      const mockData = { data: { result: [] } };
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchPrefectures(mockApi);
      expect(result).toEqual([]);
    });

    it('Handles network error correctly', async () => {
      const mockError = new Error('Network Error') as AxiosError;
      mockError.isAxiosError = true;
      mockError.response = undefined;
      mockApi.get.mockRejectedValue(mockError);

      await expect(fetchPrefectures(mockApi)).rejects.toThrow('Network Error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('都道府県データの取得に失敗しました:', mockError);
    });

    it('Handles unexpected API response format', async () => {
      const mockData = { data: { unexpected: 'format' } };
      mockApi.get.mockResolvedValue(mockData);

      await expect(fetchPrefectures(mockApi)).rejects.toThrow('Unexpected API response format');
      expect(consoleErrorSpy).toHaveBeenCalledWith('都道府県データの取得に失敗しました:', expect.any(Error));
    });

    it('Handles non-array result property in API response', async () => {
      const mockData = { data: { result: 'not an array' } };
      mockApi.get.mockResolvedValue(mockData);

      await expect(fetchPrefectures(mockApi)).rejects.toThrow('Unexpected API response format');
      expect(consoleErrorSpy).toHaveBeenCalledWith('都道府県データの取得に失敗しました:', expect.any(Error));
    });

    it('Throws error if result property is missing in API response', async () => {
      const mockResponse = { data: {} };
      mockApi.get.mockResolvedValue(mockResponse);

      await expect(apiModule.fetchPrefectures(mockApi)).rejects.toThrow('Unexpected API response format');
    });

    it('Throws error if API response is null', async () => {
      mockApi.get.mockResolvedValue(null);

      await expect(fetchPrefectures(mockApi)).rejects.toThrow('Unexpected API response format');
      expect(consoleErrorSpy).toHaveBeenCalledWith('都道府県データの取得に失敗しました:', expect.any(Error));
    });
  });

  describe('fetchPopulation', () => {
    const mockPopulationData = {
      総人口: [{ year: 2020, value: 5000000 }],
      年少人口: [{ year: 2020, value: 1000000 }],
      生産年齢人口: [{ year: 2020, value: 3000000 }],
      老年人口: [{ year: 2020, value: 1000000 }]
    };

    it('Fetches data successfully', async () => {
      const mockData = { 
      data: { 
        result: {
          data: [
            { label: "総人口", data: [{ year: 2020, value: 5000000 }] },
            { label: "年少人口", data: [{ year: 2020, value: 1000000 }] },
            { label: "生産年齢人口", data: [{ year: 2020, value: 3000000 }] },
            { label: "老年人口", data: [{ year: 2020, value: 1000000 }] }
          ]
        } 
      } 
    };
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchPopulation(1, mockApi);
      expect(result).toEqual(mockPopulationData);
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/population/composition/perYear', {
        params: { prefCode: 1, cityCode: '-' },
      });
    });

    it('Handles API error correctly', async () => {
      const mockError = new Error('APIエラー') as AxiosError;
      mockApi.get.mockRejectedValue(mockError);

      await expect(fetchPopulation(1, mockApi)).rejects.toThrow('APIエラー');
      expect(consoleErrorSpy).toHaveBeenCalledWith('人口データの取得に失敗しました:', mockError);
    });

    it('Throws error for invalid prefCode', async () => {
      await expect(fetchPopulation(-1, mockApi)).rejects.toThrow('Invalid prefCode');
      await expect(fetchPopulation(0, mockApi)).rejects.toThrow('Invalid prefCode');
      await expect(fetchPopulation(48, mockApi)).rejects.toThrow('Invalid prefCode');
    });

    it('Handles empty data correctly', async () => {
      const mockData = { 
        data: { 
          result: {
            data: [
              { label: "総人口", data: [] },
              { label: "年少人口", data: [] },
              { label: "生産年齢人口", data: [] },
              { label: "老年人口", data: [] }
            ]
          } 
        } 
      };
      mockApi.get.mockResolvedValue(mockData);

      const result = await fetchPopulation(1, mockApi);
      expect(result).toEqual({
        総人口: [],
        年少人口: [],
        生産年齢人口: [],
        老年人口: []
      });
    });

    it('Works correctly for boundary prefCode values (1 and 47)', async () => {
      const mockData = { 
        data: { 
          result: {
            data: [
              { label: "総人口", data: [{ year: 2020, value: 5000000 }] },
              { label: "年少人口", data: [{ year: 2020, value: 1000000 }] },
              { label: "生産年齢人口", data: [{ year: 2020, value: 3000000 }] },
              { label: "老年人口", data: [{ year: 2020, value: 1000000 }] }
            ]
          } 
        } 
      };
      mockApi.get.mockResolvedValue(mockData);
  
      await expect(apiModule.fetchPopulation(1, mockApi)).resolves.toEqual(mockPopulationData);
      await expect(apiModule.fetchPopulation(47, mockApi)).resolves.toEqual(mockPopulationData);
    });

    it('Throws error for non-integer prefCode', async () => {
      await expect(apiModule.fetchPopulation(1.5, mockApi)).rejects.toThrow('Invalid prefCode');
      await expect(apiModule.fetchPopulation(NaN, mockApi)).rejects.toThrow('Invalid prefCode');
      await expect(apiModule.fetchPopulation(Infinity, mockApi)).rejects.toThrow('Invalid prefCode');
      await expect(fetchPopulation('1' as any, mockApi)).rejects.toThrow('Invalid prefCode');
    });

    it('Handles network error correctly', async () => {
      const mockError = new Error('Network Error') as AxiosError;
      mockError.isAxiosError = true;
      mockError.response = undefined;
      mockApi.get.mockRejectedValue(mockError);

      await expect(fetchPopulation(1, mockApi)).rejects.toThrow('Network Error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('人口データの取得に失敗しました:', mockError);
    });

    it('Throws error if API response is null', async () => {
      mockApi.get.mockResolvedValue(null);
  
      await expect(fetchPopulation(1, mockApi)).rejects.toThrow('Unexpected API response format');
      expect(consoleErrorSpy).toHaveBeenCalledWith('人口データの取得に失敗しました:', expect.any(Error));
    }); 

    it('Handles unexpected API response format', async () => {
      const mockData = { data: { result: 'unexpected format' } };
      mockApi.get.mockResolvedValue(mockData);

      await expect(fetchPopulation(1, mockApi)).rejects.toThrow('Unexpected API response format');
      expect(consoleErrorSpy).toHaveBeenCalledWith('人口データの取得に失敗しました:', expect.any(Error));
    });

    it('Throws error if data property is missing in API response', async () => {
      const mockResponse = {};
      mockApi.get.mockResolvedValue(mockResponse);

      await expect(apiModule.fetchPopulation(1, mockApi)).rejects.toThrow('Unexpected API response format');
      expect(consoleErrorSpy).toHaveBeenCalledWith('人口データの取得に失敗しました:', expect.any(Error));
    });

    it('Handles error when data.result.data does not exist in the API response', async () => {
      const mockData = { data: { result: {} } };
      mockApi.get.mockResolvedValue(mockData);

      await expect(fetchPopulation(1, mockApi)).rejects.toThrow('Unexpected API response format');
      expect(consoleErrorSpy).toHaveBeenCalledWith('人口データの取得に失敗しました:', expect.any(Error));
    });

    it('Throws error if data.result in the API response is an array', async () => {
      const mockResponse = { data: { result: [] } };
      mockApi.get.mockResolvedValue(mockResponse);

      await expect(apiModule.fetchPopulation(1, mockApi)).rejects.toThrow('Unexpected API response format');
      expect(consoleErrorSpy).toHaveBeenCalledWith('人口データの取得に失敗しました:', expect.any(Error));
    });

    it('Throws error if data.result.data exists but is not an array in the API response', async () => {
      const mockResponse = { data: { result: { data: {} } } };
      mockApi.get.mockResolvedValue(mockResponse);

      await expect(apiModule.fetchPopulation(1, mockApi)).rejects.toThrow('Unexpected API response format');
      expect(consoleErrorSpy).toHaveBeenCalledWith('人口データの取得に失敗しました:', expect.any(Error));
    });

    it('Sets an empty array for missing population categories', async () => {
      const mockData = { 
        data: { 
          result: {
            data: [
              { label: "総人口", data: [{ year: 2020, value: 5000000 }] },
              { label: "年少人口", data: [{ year: 2020, value: 1000000 }] }
              // 生産年齢人口と老年人口が欠けている
            ]
          } 
        } 
      };
      mockApi.get.mockResolvedValue(mockData);
  
      const result = await fetchPopulation(1, mockApi);
      expect(result).toEqual({
        総人口: [{ year: 2020, value: 5000000 }],
        年少人口: [{ year: 2020, value: 1000000 }],
        生産年齢人口: [],
        老年人口: []
      });
    });
  
    it('Ignores unexpected population category labels', async () => {
      const mockData = { 
        data: { 
          result: {
            data: [
              { label: "総人口", data: [{ year: 2020, value: 5000000 }] },
              { label: "予期しないカテゴリ", data: [{ year: 2020, value: 1000000 }] },
              { label: "年少人口", data: [{ year: 2020, value: 1000000 }] },
              { label: "生産年齢人口", data: [{ year: 2020, value: 3000000 }] },
              { label: "老年人口", data: [{ year: 2020, value: 1000000 }] }
            ]
          } 
        } 
      };
      mockApi.get.mockResolvedValue(mockData);
  
      const result = await fetchPopulation(1, mockApi);
      expect(result).toEqual({
        総人口: [{ year: 2020, value: 5000000 }],
        年少人口: [{ year: 2020, value: 1000000 }],
        生産年齢人口: [{ year: 2020, value: 3000000 }],
        老年人口: [{ year: 2020, value: 1000000 }]
      });
      // 予期しないカテゴリが結果に含まれていないことを確認
      expect(result).not.toHaveProperty('予期しないカテゴリ');
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
