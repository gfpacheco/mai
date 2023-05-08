import { useQuery } from '@tanstack/react-query';

import { DocumentsResponse, fetchDocuments } from '../lib/api';

export const documentsQueryKey = 'documents';

export function useDocuments() {
  const { isLoading, error, data } = useQuery<DocumentsResponse, Error>(
    [documentsQueryKey],
    fetchDocuments,
  );

  return {
    isLoadingDocuments: isLoading,
    documentsError: error,
    documentsData: data,
  };
}
