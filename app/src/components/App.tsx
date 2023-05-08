import { useAskQuestion } from '../hooks/useAskQuestion';
import { useDeleteAllDocuments } from '../hooks/useDeleteAllDocuments';
import { useDeleteDocument } from '../hooks/useDeleteDocument';
import { useDocuments } from '../hooks/useDocuments';
import { useUploadDocuments } from '../hooks/useUploadDocument';
import { Answer } from './Answer';
import { Errors } from './Errors';
import { Files } from './Files';
import { QuestionInput } from './QuestionInput';
import { Upload } from './Upload';

export function App() {
  const { isLoadingDocuments, documentsError, documentsData } = useDocuments();

  const { uploadDocuments, isUploadingDocuments, uploadDocumentsError } =
    useUploadDocuments();

  const {
    deleteAllDocuments,
    isDeletingAllDocuments,
    deleteAllDocumentsError,
  } = useDeleteAllDocuments();

  const { deleteDocument, isDeletingDocument, deleteDocumentError } =
    useDeleteDocument();

  const { askQuestion, isAskingQuestion, askQuestionError, answer } =
    useAskQuestion();

  return (
    <div className="mx-auto max-w-screen-lg p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">MAI (MyAI)</h1>
      <QuestionInput onSubmit={askQuestion} loading={isAskingQuestion} />
      <Answer answer={answer} />
      <Files
        isLoadingDocuments={isLoadingDocuments}
        isDeletingAllDocuments={isDeletingAllDocuments}
        isDeletingDocument={isDeletingDocument}
        documentsData={documentsData}
        deleteAllDocuments={deleteAllDocuments}
        deleteDocument={deleteDocument}
      />
      <Upload
        isUploadingDocuments={isUploadingDocuments}
        uploadDocuments={uploadDocuments}
      />
      <Errors
        errors={[
          documentsError,
          uploadDocumentsError,
          deleteAllDocumentsError,
          deleteDocumentError,
          askQuestionError,
        ]}
      />
    </div>
  );
}
