export type Document = {
  id: string;
  metadata: {
    name: string;
  };
};

export type DocumentsResponse = {
  documents: Document[];
};

export type AskQuestionResponse = {
  answer: string;
};

async function apiFetch<T>(path: string, options?: RequestInit) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, options);
  return res.json() as Promise<T>;
}

export function fetchDocuments() {
  return apiFetch<DocumentsResponse>('/documents');
}

export async function uploadDocuments(documents: File[]) {
  await Promise.all(documents.map(uploadDocument));
}

async function uploadDocument(document: File) {
  const data = new FormData();
  data.append('file', document);
  data.append('metadata', document.name);

  await apiFetch('/upsert-file', {
    method: 'POST',
    body: data,
  });
}

export async function deleteAllDocuments() {
  await apiFetch('/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      delete_all: true,
    }),
  });
}

export async function deleteDocument(id: string) {
  await apiFetch('/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ids: [id],
    }),
  });
}

export function askQuestion(question: string) {
  return apiFetch<AskQuestionResponse>('/question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
    }),
  });
}
