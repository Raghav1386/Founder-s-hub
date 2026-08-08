/**
 * crawlAll.js
 * 
 * Purpose:
 * Master orchestration script that crawls all configured government source websites sequentially.
 * 
 * Responsibilities:
 * 1. Connect to MongoDB instance.
 * 2. Import all government portal configurations from configs/.
 * 3. Generate a unique crawlRunId for the global execution.
 * 4. Log total start time, per-source execution, and end time.
 * 5. Run crawlSource() on each configuration sequentially.
 * 6. Wrap each source in try/catch so a failure in one source does not halt the remaining sources.
 * 7. Close MongoDB connection cleanly when finished.
 */

import { MongoClient } from 'mongodb';

// Import all government site configuration files
import aimConfig from './configs/aim.js';
import dpiitConfig from './configs/dpiit.js';
import gemConfig from './configs/gem.js';
import investIndiaConfig from './configs/investindia.js';
import mshConfig from './configs/msh.js';
import msmeConfig from './configs/msme.js';
import nswsConfig from './configs/nsws.js';
import sidbiConfig from './configs/sidbi.js';
import startupIndiaConfig from './configs/startupindia.js';
import mySchemeConfig from './configs/myScheme.js';
import nidhiConfig from './configs/nidhi.js';
import biracConfig from './configs/birac.js';
import tdbConfig from './configs/tdb.js';
import agricultureConfig from './configs/agriculture.js';

// Import crawler engine module and logger
import { crawlSource } from './engine/crawlSource.js';
import { logger } from './engine/logger.js';

/**
 * Array of all source configurations to process in this crawl run
 */
const allConfigs = [
    startupIndiaConfig,
    msmeConfig,
    sidbiConfig,
    investIndiaConfig,
    gemConfig,
    dpiitConfig,
    aimConfig,
    mshConfig,
    nswsConfig,
    mySchemeConfig,
    nidhiConfig,
    biracConfig,
    tdbConfig,
    agricultureConfig
];

/**
 * Orchestrates sequentially crawling all registered government web sources.
 * 
 * @returns {Promise<void>}
 */
export async function crawlAll() {
    const startTime = new Date();
    // Generate a unique crawl run identifier based on current timestamp
    const crawlRunId = `crawl_run_${Date.now()}`;

    logger.info(`=======================================================`);
    logger.info(`🚀 Starting FounderPilot Global Web Crawl Run`);
    logger.info(`🆔 Run ID: ${crawlRunId}`);
    logger.info(`⏰ Start Time: ${startTime.toISOString()}`);
    logger.info(`🌐 Total Configured Sources: ${allConfigs.length}`);
    logger.info(`=======================================================`);

    // MongoDB connection setup
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/founderpilot';
    const dbName = process.env.MONGODB_DB_NAME || 'founderpilot';
    const collectionName = process.env.MONGODB_COLLECTION || 'documents';

    let mongoClient = null;

    try {
        // Connect to MongoDB with connection timeout fallback options
        logger.info(`Connecting to MongoDB at: ${mongoUri}`);
        mongoClient = new MongoClient(mongoUri, {
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000
        });
        await mongoClient.connect();

        const db = mongoClient.db(dbName);
        const dbCollection = db.collection(collectionName);
        logger.success(`Successfully connected to MongoDB database "${dbName}", collection "${collectionName}"`);

        // Array to collect summary stats for each source
        const runSummaries = [];

        // Crawl each configuration sequentially
        for (let i = 0; i < allConfigs.length; i++) {
            const currentConfig = allConfigs[i];
            const sourceName = currentConfig.name || currentConfig.source || `Source #${i + 1}`;

            logger.info(`\n-------------------------------------------------------`);
            logger.info(`[${i + 1}/${allConfigs.length}] Processing Source: ${sourceName}`);
            logger.info(`-------------------------------------------------------`);

            try {
                // Execute crawl for single source configuration
                const sourceStats = await crawlSource(currentConfig, dbCollection, crawlRunId);
                runSummaries.push({ source: sourceName, status: 'success', stats: sourceStats });
            } catch (sourceError) {
                // Catch error so failure in one source does NOT stop the remaining sources
                logger.error(`Source "${sourceName}" failed with error: ${sourceError.message}`, sourceError);
                runSummaries.push({ source: sourceName, status: 'failed', error: sourceError.message });
            }
        }

        const endTime = new Date();
        const durationSeconds = ((endTime.getTime() - startTime.getTime()) / 1000).toFixed(2);

        logger.info(`\n=======================================================`);
        logger.success(`🎉 Global Web Crawl Run Completed!`);
        logger.info(`⏰ End Time: ${endTime.toISOString()}`);
        logger.info(`⏱️ Total Duration: ${durationSeconds} seconds`);
        logger.info(`=======================================================`);

        // Log final breakdown for each source
        console.table(runSummaries.map(s => ({
            Source: s.source,
            Status: s.status,
            Processed: s.stats ? s.stats.totalProcessed : 0,
            Inserted: s.stats ? s.stats.inserted : 0,
            Updated: s.stats ? s.stats.updated : 0,
            Unchanged: s.stats ? s.stats.unchanged : 0,
            Skipped: s.stats ? s.stats.skipped : 0,
            Failed: s.stats ? s.stats.failed : 0
        })));

    } catch (dbError) {
        logger.error(`Fatal error connecting to MongoDB or initializing crawl run:`, dbError);
    } finally {
        // Ensure MongoDB client connection is closed properly when finished
        if (mongoClient) {
            await mongoClient.close();
            logger.info(`Closed MongoDB database connection.`);
        }
    }
}

export default crawlAll;
