import axios from 'axios';
import qs from 'qs';
import { siteUrl } from 'utils/getEnv';

// const siteUrl = (path) => `http://192.168.88.201:3050/solfeo/v1/${path}`;
// const siteUrl = (path) => `http://localhost:3050/solfeo/v1/${path}`;
// const apiUrl = import.meta.env.VITE_API_URL;
// const siteUrl = (path) => apiUrl + path;

export const getUser = async (nbItem, page, username = '', status = 'all', orderField = 'username', orderDirection = 'asc') => {
  const customConfig = {
    headers: {
      'Content-Type': 'application/json'
    },
    params: {}
  };
  if (status === 'activate') {
    status = 100;
  } else if (status === 'deactivate') {
    status = 0;
  }

  if (nbItem !== null && nbItem !== undefined) customConfig.params.nbItem = nbItem;
  if (page !== null && page !== undefined) customConfig.params.page = page;
  if (username !== '') customConfig.params.username = username;
  if (status !== 'all') customConfig.params.status = status;
  customConfig.params.orderField = orderField;
  customConfig.params.orderDirection = orderDirection;

  try {
    const response = await axios.get(siteUrl('users-front'), customConfig);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('There was an error fetching the users!', error);
    return null;
  }
};

export const activateUser = async (id) => {
  const data = qs.stringify({
    id: id,
    status: '100'
  });

  const config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: siteUrl('users-front'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('There was an error activating the user!', error);
    return null;
  }
};

export const deactivateUser = async (id) => {
  const data = qs.stringify({
    id: id,
    status: '0'
  });

  const config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: siteUrl('users-front'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('There was an error deactivating the user!', error);
    return null;
  }
};

export const deleteUser = async (id) => {
  const data = qs.stringify({
    id: id
  });

  const config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: siteUrl('users-front'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('There was an error deleting the user!', error);
    return null;
  }
};
