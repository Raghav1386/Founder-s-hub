import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * embeddingModel.js (src/embeddings/embeddingModel.js)
 * 
 * Purpose:
 * Generates vector embeddings for text chunks using Jina AI's Free Embedding API.
 * Compatible with LangChain JS Embeddings interface (embedDocuments & embedQuery).
 * Includes automatic 429 token rate limit retry logic.
 * 
 * Default Model: jina-embeddings-v3 (Output dimension: 1024)
 */
export class JinaEmbeddingModel {
    constructor(options = {}) {
        this.apiKey = options.apiKey || process.env.JINA_API_KEY || process.env.JINA || process.env.JINA_EMBEDDINGS_API_KEY;
        this.model = options.model || process.env.JINA_MODEL || 'jina-embeddings-v3';
        this.dimensions = options.dimensions || 1024; // 1024 for v3, 768 for v2
        this.apiUrl = 'https://api.jina.ai/v1/embeddings';

        if (!this.apiKey) {
            console.warn('⚠️ Warning: JINA_API_KEY is not set in environment variables (.env).');
        }
    }

    /**
     * Generates vector embeddings for an array of text chunks with 429 rate limit backoff.
     * 
     * @param {Array<string>} texts - Array of chunk text strings.
     * @returns {Promise<Array<Array<number>>>} Array of vector embedding float arrays.
     */
    async embedDocuments(texts) {
        if (!texts || texts.length === 0) {
            return [];
        }

        if (!this.apiKey) {
            throw new Error('Missing JINA_API_KEY in environment variables.');
        }

        // Process in small batches of 16 to stay smoothly under token limits
        const BATCH_SIZE = 16;
        const allEmbeddings = [];

        for (let i = 0; i < texts.length; i += BATCH_SIZE) {
            const batchTexts = texts.slice(i, i + BATCH_SIZE);
            let success = false;
            let maxRetries = 3;

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    const response = await fetch(this.apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.apiKey.trim()}`
                        },
                        body: JSON.stringify({
                            model: this.model,
                            task: 'retrieval.passage',
                            dimensions: this.dimensions,
                            input: batchTexts
                        })
                    });

                    if (!response.ok) {
                        const errText = await response.text();
                        const isRateLimit = response.status === 429 || errText.includes('RATE_TOKEN_LIMIT_EXCEEDED') || errText.includes('rate limit');
                        
                        if (isRateLimit && attempt < maxRetries) {
                            console.warn(`⏳ [Jina Token Limit 429] Batch ${Math.floor(i / BATCH_SIZE) + 1}: Waiting 45s for quota reset before attempt ${attempt + 1}/${maxRetries}...`);
                            await sleep(45000); // Wait 45 seconds for token bucket reset
                            continue;
                        }

                        throw new Error(`Jina Embeddings API Error (${response.status}): ${errText}`);
                    }

                    const data = await response.json();
                    
                    if (!data.data || !Array.isArray(data.data)) {
                        throw new Error('Invalid response structure returned by Jina API.');
                    }

                    // Extract vector embedding arrays sorted by index
                    const batchEmbeddings = data.data
                        .sort((a, b) => a.index - b.index)
                        .map((item) => item.embedding);

                    allEmbeddings.push(...batchEmbeddings);
                    success = true;
                    break;

                } catch (err) {
                    if (attempt === maxRetries) {
                        throw err;
                    }
                }
            }

            // Small 500ms pause between batches to prevent hammering API
            if (i + BATCH_SIZE < texts.length) {
                await sleep(500);
            }
        }

        return allEmbeddings;
    }

    /**
     * Generates vector embedding for a single search query string.
     * 
     * @param {string} queryText - Search query string.
     * @returns {Promise<Array<number>>} Single vector embedding float array.
     */
    async embedQuery(queryText) {
        const embeddings = await this.embedDocuments([queryText]);
        return embeddings[0];
    }
}

// Export default singleton instance
export const jinaEmbeddings = new JinaEmbeddingModel();
export default jinaEmbeddings;
