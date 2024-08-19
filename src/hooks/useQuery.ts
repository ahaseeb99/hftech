import { useEffect, useState } from 'react';
import apiClient from '../utils/axios';

const useQueryHook = (url, refetch) => {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: '',
  });

  useEffect(() => {
    const fetch = async () => {
      apiClient
        .get(url)
        .then(({ data }) => setState({ data, isLoading: false, error: '' }))
        .catch(error =>
          setState({ data: null, isLoading: false, error: error.message })
        );
    };

    fetch();
  }, [url, refetch]);

  return state;
};

export default useQueryHook;