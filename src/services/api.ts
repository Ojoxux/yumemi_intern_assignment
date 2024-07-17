import axios, { AxiosInstance } from 'axios';

const API_ENDPOINT = 'https://opendata.resas-portal.go.jp';

export const createApi = (axiosCreate = axios.create): AxiosInstance => {
  const API_KEY = process.env.VITE_REACT_APP_RESAS_API_KEY || '';
  return axiosCreate({
    baseURL: API_ENDPOINT,
    headers: { 'X-API-KEY': API_KEY },
  });
};

export let api: AxiosInstance;
export const initializeApi = () => {
  api = createApi();
}

// 実行環境がテスト環境でない場合のみAPIを初期化
if(process.env.NODE_ENV !== 'test') {
  initializeApi();
}

export const fetchPrefectures = async (apiInstance: AxiosInstance = api) => {
  try {
    const response = await apiInstance.get('/api/v1/prefectures');
    if (!response || !response.data || !response.data.result || !Array.isArray(response.data.result)) {
      throw new Error('Unexpected API response format');
    }
    return response.data.result;
  } catch (error) {
    console.error('都道府県データの取得に失敗しました:', error);
    throw error;
  }
};

export const fetchPopulation = async (prefCode: number, apiInstance: AxiosInstance = api) => {
  if (!Number.isInteger(prefCode) || prefCode < 1 || prefCode > 47) {
    throw new Error('Invalid prefCode');
  }

  try {
    const response = await apiInstance.get('/api/v1/population/composition/perYear', {
      params: { prefCode, cityCode: '-' },
    });

    if (!response || !response.data || !response.data.result || !Array.isArray(response.data.result.data)) {
      throw new Error('Unexpected API response format');
    }

    // カテゴリー別のデータを整形して返す
    const formattedData = {
      総人口: response.data.result.data.find((d: any) => d.label === '総人口')?.data || [],
      年少人口: response.data.result.data.find((d: any) => d.label === '年少人口')?.data || [],
      生産年齢人口: response.data.result.data.find((d: any) => d.label === '生産年齢人口')?.data || [],
      老年人口: response.data.result.data.find((d: any) => d.label === '老年人口')?.data || [],
    };

    return formattedData;
  } catch (error) {
    console.error('人口データの取得に失敗しました:', error);
    throw error;
  }
};