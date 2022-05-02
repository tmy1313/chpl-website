import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchChangeRequests = () => {
  const axios = useAxios();
  return useQuery(['change-requests'], async () => {
    const response = await axios.get('change-requests');
    return response.data;
  });
};

const useFetchChangeRequestStatusTypes = () => {
  const axios = useAxios();
  return useQuery(['change-request-status-types'], async () => {
    const response = await axios.get('data/change-request-status-types');
    return response.data;
  }, options.daily);
};

const useFetchChangeRequestTypes = () => {
  const axios = useAxios();
  return useQuery(['change-request-types'], async () => {
    const response = await axios.get('data/change-request-types');
    return response.data;
  }, options.daily);
};

const usePostChangeRequest = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.post('change-requests', data)
    .then((response) => response)
    .catch((error) => {
      throw error;
    }), {
    onSuccess: () => {
      queryClient.invalidateQueries('change-requests');
      queryClient.invalidateQueries({
        predicate: (query) => /developer\/.*attestations/.test(query.queryKey[0]),
      });
    },
    onError: (error) => {
      if (error.response.data.error?.startsWith('Email could not be sent to')) {
        queryClient.invalidateQueries('change-requests');
        queryClient.invalidateQueries({
          predicate: (query) => /developer\/.*attestations/.test(query.queryKey[0]),
        });
      }
      return error;
    },
  });
};

const usePutChangeRequest = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation(async (data) => axios.put('change-requests', data)
    .then((response) => response)
    .catch((error) => {
      throw error;
    }), {
    onSuccess: () => {
      queryClient.invalidateQueries('change-requests');
      queryClient.invalidateQueries({
        predicate: (query) => /developer\/.*attestations/.test(query.queryKey[0]),
      });
    },
    onError: (error) => {
      if (error.response.data.error?.startsWith('Email could not be sent to')) {
        queryClient.invalidateQueries('change-requests');
        queryClient.invalidateQueries({
          predicate: (query) => /developer\/.*attestations/.test(query.queryKey[0]),
        });
      }
      return error;
    },
  });
};

export {
  useFetchChangeRequests,
  useFetchChangeRequestStatusTypes,
  useFetchChangeRequestTypes,
  usePostChangeRequest,
  usePutChangeRequest,
};