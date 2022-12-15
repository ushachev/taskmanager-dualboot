import axios from 'axios';
import qs from 'qs';

import { camelize, decamelize } from './keysConverter';

function authenticityToken() {
  const token = document.querySelector('meta[name="csrf-token"]');
  return token ? token.content : null;
}

function headers() {
  return {
    Accept: '*/*',
    'Content-Type': 'application/json',
    'X-CSRF-Token': authenticityToken(),
    'X-Requested-With': 'XMLHttpRequest',
  };
}

axios.defaults.headers.get = headers();
axios.defaults.headers.post = headers();
axios.defaults.headers.patch = headers();
axios.defaults.headers.delete = headers();
axios.interceptors.response.use(null, (error) => {
  if (error.response.status === 422) {
    const {
      response: { data: errors },
    } = error;
    return Promise.reject(camelize(errors.errors));
  }

  if (error.response.status === 500) {
    return Promise.reject(new Error('Something went wrong, please retry again'));
  }

  return Promise.reject(error);
});

export default {
  async get(url, params = {}) {
    const response = await axios.get(url, {
      params: decamelize(params),
      paramsSerializer: {
        serialize: (parameters) => qs.stringify(parameters, { encode: false }),
      },
    });

    return camelize(response);
  },

  async post(url, json) {
    const body = decamelize(json);
    const response = await axios.post(url, body);

    return camelize(response);
  },

  async patch(url, json) {
    const body = decamelize(json);
    const response = await axios.patch(url, body);

    return camelize(response);
  },

  async delete(url) {
    const response = await axios.delete(url);
    return camelize(response);
  },
};
