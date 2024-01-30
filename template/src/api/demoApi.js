import { api } from '../utils';

export function hello() {
  return api((axios) => axios.post('/api/hello'));
}
