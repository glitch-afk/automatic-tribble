import axios from 'axios';

export const request = (query: string, variables: any) => {
  console.log(process.env, "!23")
  return axios({
    method: "POST",
    url: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    data: {
      query,
      variables,
    },
    headers: {
      "content-type": "application/json",
      "secret-key": process.env.NEXT_PUBLIC_SECRET_KEY,
    },
  });
};
