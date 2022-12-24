import { BACKEND_BASE_URL, SECRET_KEY } from '@/config'
import axios from 'axios'

export const request = (query: string, variables: any) => {
  return axios({
    method: 'POST',
    url: BACKEND_BASE_URL,
    data: {
      query,
      variables
    },
    headers: {
      'content-type': 'application/json',
      'secret-key': SECRET_KEY
    }
  })
}