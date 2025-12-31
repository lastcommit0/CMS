import { persistQueryClient } from '@tanstack/query-persist-client-core';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { queryClient } from './queryClient'

export const enableQueryPersistence = () => {
  const asyncPersister = createAsyncStoragePersister({
    storage: window.sessionStorage, 
    key: 'MY_APP_CACHE',
    throttleTime: 1000, 
  });

  persistQueryClient({
    queryClient,
    persister: asyncPersister,
    maxAge: 5 * 60 * 1000, 
  });
};