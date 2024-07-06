import axios from 'axios';

const API_ENDPOINT = 'https://opendata.resas-portal.go.jp';
const API_KEY = import.meta.env.VITE_REACT_APP_RESAS_API_KEY;

const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: { 'X-API-KEY': API_KEY },
});

export const fetchPrefectures = async () => {
  const response = await api.get('/api/v1/prefectures');
  return response.data.result;
};

export const fetchPopulation = async (prefCode: number) => {
  const response = await api.get('/api/v1/population/composition/perYear', {
    params: { prefCode, cityCode: '-' },
  });
  return response.data.result.data;
};
