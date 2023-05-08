import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteDocument } from '../lib/api';
import { documentsQueryKey } from './useDocuments';

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const [deletingDocumentId, setDeletingDocumentId] = useState<
    string | undefined
  >();

  const { mutate, error } = useMutation<void, Error, string>(deleteDocument, {
    onSettled() {
      setDeletingDocumentId(undefined);
      queryClient.invalidateQueries({ queryKey: [documentsQueryKey] });
    },
  });

  return {
    deleteDocument(id: string) {
      setDeletingDocumentId(id);
      mutate(id);
    },
    deletingDocumentId,
    deleteDocumentError: error,
  };
}
