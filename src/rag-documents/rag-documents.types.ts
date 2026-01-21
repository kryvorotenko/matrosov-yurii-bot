export interface RagDocumentsSimilarityResult {
  id: string;
  title: string;
  content: string;
  score: number;
}

export const RAG_THRESHOLD = 0.3;