export const BACKEND_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/graphql'
    : 'https://api.fetcch.xyz';
export const SECRET_KEY =
  process.env.NODE_ENV === 'development'
    ? 'e0fdde36-cd4f-4e88-be2e-86ef557708cd'
    : 'e0fdde36-cd4f-4e88-be2e-86ef557708cd';
