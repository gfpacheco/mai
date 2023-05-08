import { DocumentsResponse } from '../lib/api';
import { Button } from './Button';
import { LoadingIndicator } from './LoadingIndicator';

export type FilesProps = {
  isLoadingDocuments: boolean;
  isDeletingAllDocuments: boolean;
  deletingDocumentId?: string;
  documentsData?: DocumentsResponse;
  deleteAllDocuments: () => void;
  deleteDocument: (id: string) => void;
};

export function Files({
  isLoadingDocuments,
  isDeletingAllDocuments,
  deletingDocumentId,
  documentsData,
  deleteAllDocuments,
  deleteDocument,
}: FilesProps) {
  const hasDocuments = documentsData && documentsData.documents.length > 0;

  return (
    <>
      <div className="flex items-center gap-4">
        <p className="font-bold">Knoweledge base</p>
        {isLoadingDocuments && <LoadingIndicator />}
        <div className="flex-1" />
        {hasDocuments && (
          <Button
            className="bg-red-500"
            onClick={deleteAllDocuments}
            loading={isDeletingAllDocuments}
          >
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
                onClick={() => deleteDocument(document.id)}
                loading={deletingDocumentId === document.id}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
