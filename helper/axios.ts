import axios, { AxiosRequestConfig } from 'axios';

export const apiCall = (config: AxiosRequestConfig) => {
  console.log(config);
  return axios({
    ...config,
    url: `${process.env.NEXT_PUBLIC_BaseUrl}${config.url}`
  });
};
