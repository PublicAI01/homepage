import Axios from 'axios';

const axios = Axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});
axios.interceptors.request.use((config) => {
  return config;
});
axios.interceptors.response.use(
  (response) => response.data,
  (err) => Promise.reject(err),
);

export default axios;
