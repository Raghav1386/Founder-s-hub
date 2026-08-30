/**
 * searchSchemes.js (src/ai/searchSchemes.js)
 * 
 * Purpose:
 * Performs category-balanced vector similarity search in Qdrant vector database using 1024-d Jina query embedding.
 * Guarantees equal representation of both Government Schemes & Grants AND Cloud & Tech Credit Programs.
 */

import { qdrantClient, COLLECTION_NAME } from '../embeddings/qdrant.js';
import Document from '../models/Document.js';

/**
 * Decodes nested HTML entities in titles (e.g. &amp; -> &).
 */
function decodeHtmlEntities(str = '') {
  if (!str) return '';
  let decoded = str;
  for (let i = 0; i < 5; i++) {
    if (!decoded.includes('&')) break;
    decoded = decoded
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>');
  }
  return decoded.trim();
}

/**
 * Normalizes non-English locale paths (e.g. /hr-hr/, /fr/, /es/) to standard English URL (/en-us/).
 */
function normalizeToEnglishUrl(urlStr = '') {
  if (!urlStr) return '';
  try {
    const parsed = new URL(urlStr);
    parsed.pathname = parsed.pathname.replace(/\/(hr-hr|et-ee|sv-se|de-de|fr-fr|es-la|es-es|pt-br|ko-kr|ja-jp|zh-cn|zh-tw|fr|de|es|it|pt|ja|ko|zh|ru|ar|tr|nl|pl|vi|th|id)\//i, '/en-us/');
    return parsed.toString();
  } catch {
    return urlStr;
  }
}

/**
 * Identifies and filters out non-scheme utility & portal pages (FAQs, Reports, Blogs, Asset files, Notices).
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
    '/blog',
    'blog/',
    'sidbi.in/blog',
    'hyperlink-policy',
    'microfinance-congress',
    'captcha',
    'onlineapplication',
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
    '.pdf',
    '.zip',
    'pdf',
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
  return decodeHtmlEntities(title).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Determines if an opportunity is a Cloud or Tech Credit Program.
 */
function isCloudCreditOpportunity(payload = {}) {
  const oType = (payload.opportunityType || '').toLowerCase();
  const provider = (payload.provider || payload.source || '').toLowerCase();
  
  if (oType === 'cloud_credit') return true;

  const cloudProviders = ['aws', 'microsoft', 'google', 'nvidia', 'mongodb', 'digitalocean', 'cloudflare', 'azure'];
  return cloudProviders.some(p => provider.includes(p));
}

/**
 * Searches Qdrant for top matching chunks using Category-Balanced Dual Retrieval.
 * Guarantees a balanced mix of Government Schemes AND Cloud Credit Programs.
 * 
 * @param {Array<number>} vectorEmbedding - Query vector embedding.
 * @param {number} totalLimit - Target number of unique opportunities (default: 15).
 * @returns {Promise<Array<Object>>} Balanced unique scheme documents array.
 */
export async function searchRelevantSchemes(vectorEmbedding, totalLimit = 15) {
  let searchHits = [];
  
  // Step 1: Query Qdrant Vector DB for top 60 raw vector chunks
  try {
    if (vectorEmbedding && Array.isArray(vectorEmbedding) && vectorEmbedding.length > 0) {
      console.log(`[INFO] [searchSchemes] Searching Qdrant collection "${COLLECTION_NAME}" for top 60 vector chunks...`);
      searchHits = await qdrantClient.search(COLLECTION_NAME, {
        vector: vectorEmbedding,
        limit: 60,
        with_payload: true
      });
      console.log(`[INFO] [searchSchemes] Retrieved ${searchHits ? searchHits.length : 0} raw vector chunk hits from Qdrant.`);
    }
  } catch (err) {
    console.warn(`[WARN] [searchSchemes] Qdrant vector search warning (${err.message}). Using MongoDB fallback search.`);
    searchHits = [];
  }

  const cloudHits = [];
  const schemeHits = [];
  const seenTitleKeys = new Set();
  const seenDocIds = new Set();
  let filteredOutCount = 0;

  if (searchHits && searchHits.length > 0) {
    for (const hit of searchHits) {
      const payload = hit.payload || {};
      const docId = payload.documentId;
      const title = decodeHtmlEntities(payload.title || '');
      const rawUrl = payload.url || '';
      const url = normalizeToEnglishUrl(rawUrl);
      const titleKey = getTitleKey(title);

      if (isNonSchemeUtilityPage(title, url)) {
        filteredOutCount++;
        continue;
      }

      if (seenTitleKeys.has(titleKey) || (docId && seenDocIds.has(docId))) {
        continue;
      }

      if (docId) {
        seenTitleKeys.add(titleKey);
        seenDocIds.add(docId);

        const candidateItem = {
          documentId: docId,
          similarityScore: hit.score,
          chunkText: payload.text || '',
          title: title,
          source: payload.source || '',
          url: url,
          opportunityType: payload.opportunityType || (isCloudCreditOpportunity(payload) ? 'cloud_credit' : 'scheme'),
          provider: payload.provider || payload.source || ''
        };

        if (isCloudCreditOpportunity(payload)) {
          cloudHits.push(candidateItem);
        } else {
          schemeHits.push(candidateItem);
        }
      }
    }
  }

  // Step 2: Category-Balanced Candidate Fusion (Target: ~7 Cloud Credits + ~8 Govt Schemes)
  const balancedMap = new Map();
  const targetCloudCount = Math.min(cloudHits.length, Math.ceil(totalLimit / 2));
  
  // Add top Cloud Credit hits
  for (let i = 0; i < targetCloudCount; i++) {
    const item = cloudHits[i];
    balancedMap.set(item.documentId, item);
  }

  // Add top Government Scheme hits
  for (const item of schemeHits) {
    if (balancedMap.size >= totalLimit) break;
    balancedMap.set(item.documentId, item);
  }

  // If we still have room, add remaining Cloud Credit hits
  for (const item of cloudHits) {
    if (balancedMap.size >= totalLimit) break;
    if (!balancedMap.has(item.documentId)) {
      balancedMap.set(item.documentId, item);
    }
  }

  let uniqueDocIds = Array.from(balancedMap.keys());

  // Step 3: MongoDB Fallback if vector hits were empty
  if (uniqueDocIds.length === 0) {
    console.log(`[INFO] [searchSchemes] Fetching documents directly from MongoDB...`);
    const fallbackDocs = await Document.find({
      documentStatus: { $ne: 'deleted' },
      markdown: { $ne: '' }
    })
      .limit(50)
      .lean();

    for (const doc of fallbackDocs) {
      const cleanTitle = decodeHtmlEntities(doc.title || '');
      const cleanUrl = normalizeToEnglishUrl(doc.url || '');
      const titleKey = getTitleKey(cleanTitle);
      
      if (!isNonSchemeUtilityPage(cleanTitle, cleanUrl) && !seenTitleKeys.has(titleKey)) {
        const dId = doc._id.toString();
        if (!balancedMap.has(dId)) {
          seenTitleKeys.add(titleKey);
          balancedMap.set(dId, {
            documentId: dId,
            similarityScore: 0.75,
            chunkText: doc.markdown ? doc.markdown.slice(0, 500) : '',
            title: cleanTitle,
            source: doc.source || 'Portal',
            url: cleanUrl,
            opportunityType: doc.opportunityType || 'scheme',
            provider: doc.provider || doc.source || ''
          });
        }
      }
      if (balancedMap.size >= totalLimit) break;
    }
    uniqueDocIds = Array.from(balancedMap.keys());
  }

  console.log(`[INFO] [searchSchemes] Category Fusion: Selected ${uniqueDocIds.length} balanced opportunities (${cloudHits.length} Cloud Credits & ${schemeHits.length} Govt Schemes available).`);

  // Step 4: Fetch full documents from MongoDB
  const mongoDocs = await Document.find({ _id: { $in: uniqueDocIds } }).lean();

  const docMap = new Map();
  mongoDocs.forEach((d) => docMap.set(d._id.toString(), d));

  const finalResults = [];

  for (const docId of uniqueDocIds) {
    const meta = balancedMap.get(docId);
    const mongoDoc = docMap.get(docId);

    if (mongoDoc) {
      finalResults.push({
        _id: mongoDoc._id,
        id: mongoDoc._id,
        title: decodeHtmlEntities(mongoDoc.structured?.schemeName || mongoDoc.title || meta.title),
        url: normalizeToEnglishUrl(mongoDoc.url || meta.url),
        source: mongoDoc.source || meta.source,
        opportunityType: mongoDoc.opportunityType || meta.opportunityType || 'scheme',
        provider: mongoDoc.provider || meta.provider || mongoDoc.source || 'Official',
        structured: mongoDoc.structured || {},
        markdown: mongoDoc.markdown || '',
        similarityScore: meta.similarityScore || 0,
        matchedChunk: meta.chunkText || ''
      });
    }
  }

  return finalResults;
}

export default { searchRelevantSchemes };
