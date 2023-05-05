import Dropzone from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

export function App() {
  function handleDrop(files: File[]) {
    console.log('files', files);
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
    </div>
  );
}
