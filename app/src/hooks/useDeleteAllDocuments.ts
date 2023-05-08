import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteAllDocuments } from '../lib/api';
import { documentsQueryKey } from './useDocuments';

export function useDeleteAllDocuments() {
  const queryClient = useQueryClient();

  const { mutate, isLoading, error } = useMutation<void, Error>(
    deleteAllDocuments,
    {
      onSettled() {
        queryClient.invalidateQueries({ queryKey: [documentsQueryKey] });
      },
    },
  );

  return {
    deleteAllDocuments() {
      mutate();
    },
    isDeletingAllDocuments: isLoading,
    deleteAllDocumentsError: error,
  };
}
