import { useState } from 'react';

import Dropzone from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

import { useQueryClient } from '@tanstack/react-query';

import { documentsQueryKey, useDocuments } from '../hooks/useDocuments';
import { useUploadDocuments } from '../hooks/useUploadDocument';
import { Button } from './Button';
import { Errors } from './Errors';
import { LoadingIndicator } from './LoadingIndicator';
import { QueryInput } from './QueryInput';

export function App() {
  const queryClient = useQueryClient();
  const [answer, setAnswer] = useState('');

  const { isLoadingDocuments, documentsError, documentsData } = useDocuments();

  const { uploadDocuments, isUploadingDocuments, uploadDocumentsError } =
    useUploadDocuments();

  async function handleSubmit(question: string) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
      }),
    });

    const json = await res.json();

    setAnswer(json.answer);
  }

  async function handleDeleteAll() {
    await fetch(`${import.meta.env.VITE_API_URL}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        delete_all: true,
      }),
    });

    queryClient.invalidateQueries({ queryKey: [documentsQueryKey] });
  }

  async function handleDelete(id: string) {
    await fetch(`${import.meta.env.VITE_API_URL}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids: [id],
      }),
    });

    queryClient.invalidateQueries({ queryKey: [documentsQueryKey] });
  }

  const hasDocuments = documentsData && documentsData.documents.length > 0;

  return (
    <div className="mx-auto max-w-screen-lg p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">MAI (MyAI)</h1>
      <QueryInput onSubmit={handleSubmit} />
      {answer && (
        <code className="border rounded bg-neutral-50 p-4">{answer}</code>
      )}
      <div className="flex items-center gap-4">
        <p className="font-bold">Files</p>
        {isLoadingDocuments && <LoadingIndicator />}
        <div className="flex-1" />
        {hasDocuments && (
          <Button className="bg-red-500" onClick={handleDeleteAll}>
            Delete All Files
          </Button>
        )}
      </div>
      {hasDocuments && (
        <ul className="flex flex-col gap-2">
          {documentsData?.documents?.map((document) => (
            <li key={document.id} className="flex">
              <span className="flex-1 h-10 border border-r-0 rounded-tl rounded-bl bg-neutral-50 px-4 flex items-center">
                {document.metadata.name}
              </span>
              <Button
                className="rounded-tl-none rounded-bl-none bg-red-500"
                onClick={() => handleDelete(document.id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
      <Dropzone onDrop={uploadDocuments} disabled={isUploadingDocuments}>
        {({ getRootProps, getInputProps, isDragAccept }) => (
          <div
            className={twMerge(
              'h-24 border-2 border-dashed rounded bg-neutral-50 flex items-center justify-center',
              isDragAccept && 'border-green-200 bg-green-50',
              isUploadingDocuments && 'opacity-50',
            )}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isUploadingDocuments ? (
              <LoadingIndicator />
            ) : (
              <p>Drop files here</p>
            )}
          </div>
        )}
      </Dropzone>
      <Errors errors={[documentsError, uploadDocumentsError]} />
    </div>
  );
}
