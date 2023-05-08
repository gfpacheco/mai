import { useMutation, useQueryClient } from '@tanstack/react-query';

import { uploadDocuments } from '../lib/api';
import { documentsQueryKey } from './useDocuments';

export function useUploadDocuments() {
  const queryClient = useQueryClient();

  const { mutate, isLoading, error } = useMutation<void, Error, File[]>(
    uploadDocuments,
    {
      onSettled() {
        queryClient.invalidateQueries({ queryKey: [documentsQueryKey] });
      },
    },
  );

  return {
    uploadDocuments(files: File[]) {
      mutate(files);
    },
    isUploadingDocuments: isLoading,
    uploadDocumentsError: error,
  };
}
