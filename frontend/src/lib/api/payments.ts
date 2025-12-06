import axios from 'axios';
import { authStore } from '@/stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: `${API_BASE_URL}/payments`,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const paymentsApi = {
  getPlans: () => client.get('/plans'),
  subscribe: (planId: string) => client.post('/subscribe', { planId }),
  status: () => client.get('/subscription'),
  cancel: () => client.post('/cancel'),
  portal: () => client.post('/portal'),
};
