import axios, { AxiosRequestConfig } from 'axios';

export const apiCall = (config: AxiosRequestConfig) => {
  return axios({
    ...config,
    url: `${process.env.NEXT_PUBLIC_BaseUrl}${config.url}`
  });
};
