import { useQuery } from 'react-query';

import { useAxios } from './axios';
import options from './options';

const useFetchApiDocumentationCollection = ({
  orderBy,
  pageNumber,
  pageSize,
  sortDescending,
  query,
}) => {
  const axios = useAxios();
  return useQuery(['search/v2', 'apiDocumentationCollection', {
    orderBy, pageNumber, pageSize, sortDescending, query,
  }], async () => {
    const response = await axios.get(`/search/v2?${query}&pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&sortDescending=${sortDescending}`);
    return response.data;
  }, { keepPreviousData: true });
};

const useFetchApiDocumentationData = () => {
  const axios = useAxios();
  return useQuery(['files/api_documentation/details'], async () => {
    const response = await axios.get('/files/api_documentation/details');
    return response.data;
  }, options.daily);
};

const useFetchRealWorldTestingCollection = ({
  orderBy,
  pageNumber,
  pageSize,
  sortDescending,
  query,
}) => {
  const axios = useAxios();
  return useQuery(['search/v2?rwtOptions=has_plans_url,has_results_url', orderBy, pageNumber, pageSize, sortDescending, query], async () => {
    const response = await axios.get(`/search/v2?${query}&rwtOptions=has_plans_url,has_results_url&pageNumber=${pageNumber}&pageSize=${pageSize}&orderBy=${orderBy}&sortDescending=${sortDescending}`);
    return response.data;
  }, { keepPreviousData: true });
};

export {
  useFetchApiDocumentationCollection,
  useFetchApiDocumentationData,
  useFetchRealWorldTestingCollection,
};
