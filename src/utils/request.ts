import axios from 'axios';

export const request = (query: string, variables: any) => {
  return axios({
    method: 'POST',
    url: process.env.BACKEND_BASE_URL,
    data: {
      query,
      variables,
    },
    headers: {
      'content-type': 'application/json',
      'secret-key': process.env.SECRET_KEY,
    },
  });
};
