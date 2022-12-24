import axios from 'axios';
import { useState } from 'react';

import { BACKEND_BASE_URL, SECRET_KEY } from '@/config';

export const useGraphQL = (query: string, data: any) => {
  const [result, setResult] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(undefined);

  axios({
    url: BACKEND_BASE_URL,
    method: 'POST',
    data: {
      query,
      variables: data,
    },
    headers: {
      'content-type': 'application/json',
      'secret-key': SECRET_KEY,
    },
  })
    .then((res) => res.data)
    .then((resData) => {
      setResult(resData);
      setIsLoading(false);
      setError(undefined);
    })
    .catch((e) => {
      setError(e);
      setIsLoading(false);
      setResult(undefined);
    });

  return {
    result,
    isLoading,
    error,
  };
};
