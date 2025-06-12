import { pipeline } from '@xenova/transformers';

let embedder: any;

export async function loadLocalEmbeddingModel() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  return {
    embed: async (text: string): Promise<number[]> => {
      const output = await embedder(text, { pooling: 'mean', normalize: true });
      return Array.from(output.data);
    },
  };
}

export function cosineSimilarity(vecA: number[], vecB: number[]) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (normA * normB);
}