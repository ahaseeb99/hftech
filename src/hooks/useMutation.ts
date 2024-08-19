import { useState } from 'react';
import { toastify } from '../components/toastify/toastify';
import apiClient from '../utils/axios';

const useMutation = ({ url, method = 'POST' }) => {
  const [state, setState] = useState({
    isLoading: false,
    error: '',
  });

  const fn = async data => {
    setState(prev => ({
      ...prev,
      isLoading: true,
    }));
    apiClient.post(url, data )
      .then((res) => {
        setState({ isLoading: false, error: '' });
        toastify.Success(res.data.message);
      })
      .catch(error => {
        setState({ isLoading: false, error: error.message });
      });
  };

  return { mutate: fn, ...state };
};

export default useMutation;