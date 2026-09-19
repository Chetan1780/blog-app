import { getEnv } from '@/Helper/getEnv';

export const api = async (path, options = {}) => {
  const response = await fetch(`${getEnv('VITE_API_BACKEND_URL')}${path}`, {
    credentials: 'include',
    ...options,
    headers: { Accept: 'application/json', ...options.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || 'Something went wrong.');
  return body;
};
