/**
 * runDailyPipeline.js (src/pipeline/runDailyPipeline.js)
 * 
 * Purpose:
 * Master daily pipeline runner that executes all 4 stages sequentially:
 * Stage 1: Crawl all government portals -> MongoDB (pending_structure)
 * Stage 2: Queue un-structured docs -> pending_structure
 * Stage 3: Structure markdown into scheme JSON using Gemini Flash -> pending_embedding
 * Stage 4: Chunk markdown & embed vectors into Qdrant using Jina Embeddings -> completed
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '../../');

export async function runDailyPipeline() {
  const startTime = new Date();
  console.log('\n=======================================================');
  console.log('🚀 [FOUNDERPILOT DAILY PIPELINE] STARTING ALL STAGES');
  console.log(`⏰ Timestamp: ${startTime.toISOString()}`);
  console.log('=======================================================\n');

  try {
    console.log('--- STAGE 1/4: Crawling Government Portals ---');
    execSync('node src/crawler/index.js', { cwd: backendRoot, stdio: 'inherit' });

    console.log('\n--- STAGE 2/4: Queueing Documents for Structuring ---');
    execSync('node src/pipeline/queueForStructuring.js', { cwd: backendRoot, stdio: 'inherit' });

    console.log('\n--- STAGE 3/4: Structuring Scheme Metadata (Gemini Flash) ---');
    execSync('node src/pipeline/structurePipeline.js', { cwd: backendRoot, stdio: 'inherit' });

    console.log('\n--- STAGE 4/4: Generating Jina Embeddings & Indexing Qdrant ---');
    execSync('node src/embeddings/embedDocuments.js', { cwd: backendRoot, stdio: 'inherit' });

    const durationMin = ((new Date() - startTime) / 1000 / 60).toFixed(2);
    console.log('\n=======================================================');
    console.log(`✅ [FOUNDERPILOT DAILY PIPELINE] FINISHED SUCCESSFULLY in ${durationMin} minutes!`);
    console.log('=======================================================\n');
  } catch (error) {
    console.error('❌ [FOUNDERPILOT DAILY PIPELINE] Failed during pipeline execution:', error.message);
    throw error;
  }
}

// If run directly from command line
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runDailyPipeline().catch(() => process.exit(1));
}
