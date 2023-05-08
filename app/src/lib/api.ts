export type Document = {
  id: string;
  metadata: {
    name: string;
  };
};

export type DocumentsResponse = {
  documents: Document[];
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