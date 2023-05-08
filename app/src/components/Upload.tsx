import Dropzone from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

import { LoadingIndicator } from './LoadingIndicator';

export type UploadProps = React.ComponentPropsWithoutRef<'div'> & {
  isUploadingDocuments: boolean;
  uploadDocuments(files: File[]): void;
};

export function Upload({
  className,
  isUploadingDocuments,
  uploadDocuments,
  ...rest
}: UploadProps) {
  return (
    <Dropzone onDrop={uploadDocuments} disabled={isUploadingDocuments}>
      {({ getRootProps, getInputProps, isDragAccept }) => (
        <div
          className={twMerge(
            'h-24 border-2 border-dashed rounded bg-neutral-50 flex items-center justify-center',
            isDragAccept && 'border-green-200 bg-green-50',
            isUploadingDocuments && 'opacity-50',
            className,
          )}
          {...getRootProps()}
          {...rest}
        >
          <input {...getInputProps()} />
          {isUploadingDocuments ? <LoadingIndicator /> : <p>Drop files here</p>}
        </div>
      )}
    </Dropzone>
  );
}
