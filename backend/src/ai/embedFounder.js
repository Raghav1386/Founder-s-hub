/**
 * embedFounder.js (src/ai/embedFounder.js)
 * 
 * Purpose:
 * Generates 1024-dimensional vector embedding for the founder's searchText
 * using Jina Embeddings API via LangChain.
 */

import { jinaEmbeddings } from '../embeddings/embeddingModel.js';

/**
 * Generates vector embedding for founder searchText using Jina Embeddings API.
 * 
 * @param {string} searchText - Concise natural language summary of founder profile.
 * @returns {Promise<Array<number>>} 1024-dimensional vector embedding array.
 */
export async function embedFounderSearchText(searchText) {
  if (!searchText || typeof searchText !== 'string' || !searchText.trim()) {
    throw new Error('Valid non-empty searchText string is required to generate vector embedding.');
  }

  console.log(`[INFO] [embedFounder] Generating Jina embedding vector for searchText (${searchText.length} chars)...`);
  
  const embedding = await jinaEmbeddings.embedQuery(searchText);

  if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
    throw new Error('Jina Embeddings API returned invalid or empty vector embedding.');
  }

  console.log(`[SUCCESS] [embedFounder] Successfully generated vector embedding (Dimensions: ${embedding.length}).`);
  return embedding;
}

export default embedFounderSearchText;
