import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

/**
 * textSplitter.js (src/embeddings/textSplitter.js)
 * 
 * Purpose:
 * Configures LangChain's RecursiveCharacterTextSplitter for splitting raw markdown
 * documents into optimal chunks for embedding generation.
 * 
 * Settings:
 * - chunkSize: 1000 characters
 * - chunkOverlap: 200 characters
 */

// Initialize the RecursiveCharacterTextSplitter instance
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});


export async function splitMarkdown(markdown) {
    if (!markdown || typeof markdown !== 'string' || markdown.trim().length === 0) {
        return [];
    }

    // Split markdown string into text chunks using LangChain textSplitter
    const chunks = await textSplitter.splitText(markdown);
    return chunks;
}

export default splitMarkdown;
