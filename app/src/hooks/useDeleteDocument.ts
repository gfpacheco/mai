import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteDocument } from '../lib/api';
import { documentsQueryKey } from './useDocuments';

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  const { mutate, isLoading, error } = useMutation<void, Error, string>(
    deleteDocument,
    {
      onSettled() {
        queryClient.invalidateQueries({ queryKey: [documentsQueryKey] });
      },
    },
  );

  return {
    deleteDocument(id: string) {
      mutate(id);
    },
    isDeletingDocument: isLoading,
    deleteDocumentError: error,
  };
}
