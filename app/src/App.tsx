import { useState } from 'react';

import Dropzone from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

import { Button } from './Button';
import { QueryInput } from './QueryInput';

export function App() {
  const [answer, setAnswer] = useState('');

  async function handleDrop(files: File[]) {
    const data = new FormData();
    data.append('file', files[0]);
    data.append('metadata', files[0].name);

    await fetch(`${import.meta.env.VITE_API_URL}/upsert-file`, {
      method: 'POST',
      body: data,
    });
  }

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
  }

  return (
    <div className="mx-auto max-w-screen-lg p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">MAI (MyAI)</h1>
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps, isDragAccept }) => (
          <div
            className={twMerge(
              'border-2 border-dashed rounded bg-neutral-50 p-4',
              isDragAccept && 'border-green-200 bg-green-50',
            )}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <p>Drop files here</p>
          </div>
        )}
      </Dropzone>
      <QueryInput onSubmit={handleSubmit} />
      {answer && (
        <code className="border rounded bg-neutral-50 p-4">{answer}</code>
      )}
      <div className="flex items-center gap-4">
        <p className="flex-1">Files</p>
        <Button onClick={handleDeleteAll}>Delete All Files</Button>
      </div>
    </div>
  );
}
