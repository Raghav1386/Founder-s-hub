/**
 * searchSchemes.js (src/ai/searchSchemes.js)
 * 
 * Purpose:
 * Searches Qdrant vector database using founder vector embedding,
 * retrieves top 50 relevant chunks, filters out non-scheme utility pages (e.g. FAQs, Reports, Asset files),
 * deduplicates by documentId AND normalized title, and fetches full scheme documents from MongoDB.
 * Includes a robust MongoDB fallback if Qdrant is unreachable or returns 0 hits.
 */

import { qdrantClient } from '../embeddings/qdrant.js';
import Document from '../models/Document.js';

const COLLECTION_NAME = process.env.QDRANT_COLLECTION || 'founderpilot_schemes';

/**
 * Identifies and filters out non-scheme utility & portal pages (FAQs, Reports, Asset files, Notices).
 */
function isNonSchemeUtilityPage(title = '', url = '') {
  const t = (title || '').toLowerCase();
  const u = (url || '').toLowerCase();

  const noisePatterns = [
    '/faq',
    'faqs',
    'frequently asked',
    'notice-board',
    'regulatory_updates',
    'nsa5.0results',
    'srf/home',
    'form-56',
    'privacy',
    'terms',
    'disclaimer',
    'copyright',
    'publication',
    'publications',
    'report',
    'reports',
    'understanding indian msme sector',
    'fixed deposit',
    'deposit',
    'annual',
    'circulars',
    'microfinance-pulse',
    'microfinance pulse',
    'data-gov-in',
    'action__plan',
    'playbook',
    'revised%20guidelines',
    'imb.html',
    'self-certification.html',
    '.css',
    '.js',
    '.png',
    '.jpg'
  ];

  return noisePatterns.some((pattern) => t.includes(pattern) || u.includes(pattern));
}

/**
 * Normalizes title for deduplication.
 */
function getTitleKey(title = '') {
  return (title || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Searches Qdrant for top matching scheme chunks, filters out utility pages,
 * deduplicates by documentId and title, and fetches full scheme documents from MongoDB.
 * 
 * @param {Array<number>} vectorEmbedding - Query vector embedding.
 * @param {number} limit - Number of top chunks to retrieve from Qdrant (default: 50).
 * @returns {Promise<Array<Object>>} Unique scheme documents array.
 */
export async function searchRelevantSchemes(vectorEmbedding, limit = 50) {
  let searchHits = [];
  
  // Step 1: Query Qdrant Vector DB with fallback error handling
  try {
    if (vectorEmbedding && Array.isArray(vectorEmbedding) && vectorEmbedding.length > 0) {
      console.log(`[INFO] [searchSchemes] Searching Qdrant collection "${COLLECTION_NAME}" for top ${limit} chunks...`);
      searchHits = await qdrantClient.search(COLLECTION_NAME, {
        vector: vectorEmbedding,
        limit: limit,
        with_payload: true
      });
      console.log(`[INFO] [searchSchemes] Retrieved ${searchHits ? searchHits.length : 0} raw vector chunk hits from Qdrant.`);
    }
  } catch (err) {
    console.warn(`[WARN] [searchSchemes] Qdrant vector search warning (${err.message}). Using MongoDB fallback search.`);
    searchHits = [];
  }

  // Filter out noise utility pages and deduplicate by documentId AND titleKey
  const uniqueDocMap = new Map();
  const seenTitleKeys = new Set();
  let filteredOutCount = 0;

  if (searchHits && searchHits.length > 0) {
    for (const hit of searchHits) {
      const payload = hit.payload || {};
      const docId = payload.documentId;
      const title = payload.title || '';
      const url = payload.url || '';
      const titleKey = getTitleKey(title);

      // Check if this chunk belongs to a non-scheme utility page
      if (isNonSchemeUtilityPage(title, url)) {
        filteredOutCount++;
        continue;
      }

      // Skip duplicate titles or duplicate docIds
      if (seenTitleKeys.has(titleKey) || (docId && uniqueDocMap.has(docId))) {
        continue;
      }

      if (docId) {
        seenTitleKeys.add(titleKey);
        uniqueDocMap.set(docId, {
          documentId: docId,
          similarityScore: hit.score,
          chunkText: payload.text || '',
          title: title,
          source: payload.source || '',
          url: url
        });
      }

      if (uniqueDocMap.size >= 12) {
        break;
      }
    }
  }

  let uniqueDocIds = Array.from(uniqueDocMap.keys());

  // Step 2: Fallback to MongoDB query if Qdrant hits were empty or filtered out
  if (uniqueDocIds.length === 0) {
    console.log(`[INFO] [searchSchemes] Fetching government scheme documents directly from MongoDB...`);
    const fallbackDocs = await Document.find({
      documentStatus: { $ne: 'deleted' },
      markdown: { $ne: '' }
    })
      .limit(30)
      .lean();

    // Filter fallback documents
    for (const doc of fallbackDocs) {
      const titleKey = getTitleKey(doc.title);
      if (!isNonSchemeUtilityPage(doc.title, doc.url) && !seenTitleKeys.has(titleKey)) {
        const dId = doc._id.toString();
        if (!uniqueDocMap.has(dId)) {
          seenTitleKeys.add(titleKey);
          uniqueDocMap.set(dId, {
            documentId: dId,
            similarityScore: 0.75,
            chunkText: doc.markdown ? doc.markdown.slice(0, 500) : '',
            title: doc.title || 'Government Scheme',
            source: doc.source || 'Government Portal',
            url: doc.url || ''
          });
        }
      }
      if (uniqueDocMap.size >= 10) break;
    }
    uniqueDocIds = Array.from(uniqueDocMap.keys());
  }

  console.log(`[INFO] [searchSchemes] Filtered out ${filteredOutCount} noise chunks. Deduplicated into ${uniqueDocIds.length} unique scheme documents.`);

  // Step 3: Fetch full scheme documents from MongoDB
  const mongoDocs = await Document.find({ _id: { $in: uniqueDocIds } }).lean();

  // Combine MongoDB document data with Qdrant vector similarity metadata
  const schemes = uniqueDocIds.map((docId) => {
    const qdrantMeta = uniqueDocMap.get(docId);
    const mongoDoc = mongoDocs.find((d) => d._id.toString() === docId) || {};

    return {
      documentId: docId,
      title: mongoDoc.title || qdrantMeta.title || 'Untitled Government Scheme',
      source: mongoDoc.source || qdrantMeta.source || 'Government Portal',
      url: mongoDoc.url || qdrantMeta.url || '',
      markdown: mongoDoc.markdown || qdrantMeta.chunkText || '',
      structured: mongoDoc.structured || null,
      similarityScore: qdrantMeta.similarityScore || 0.8
    };
  });

  console.log(`[SUCCESS] [searchSchemes] Successfully retrieved ${schemes.length} unique scheme records from MongoDB.`);
  return schemes;
}

export default searchRelevantSchemes;
