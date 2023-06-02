import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

export const apiCall = (config: AxiosRequestConfig) => {
  const jwtAdmin = Cookies.get('jwtAdmin');
  return axios({
    ...config,
    url: `/api/${config.url}`,
    headers: { ...config.headers, Authorization: `Bearer ${jwtAdmin}` }
  });
};
