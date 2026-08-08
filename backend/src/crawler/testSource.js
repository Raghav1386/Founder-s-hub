/**
 * testSource.js
 * 
 * Purpose:
 * Utility script to test crawling a single specific government source configuration.
 * Usage: node src/crawler/testSource.js <config_key>
 * Example: node src/crawler/testSource.js birac
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import { crawlSource } from './engine/crawlSource.js';
import { logger } from './engine/logger.js';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const configsMap = {
    aim: aimConfig,
    dpiit: dpiitConfig,
    gem: gemConfig,
    investindia: investIndiaConfig,
    msh: mshConfig,
    msme: msmeConfig,
    nsws: nswsConfig,
    sidbi: sidbiConfig,
    startupindia: startupIndiaConfig,
    myscheme: mySchemeConfig,
    nidhi: nidhiConfig,
    birac: biracConfig,
    tdb: tdbConfig,
    agriculture: agricultureConfig
};

async function runSingleSourceTest() {
    const args = process.argv.slice(2);
    const targetSourceKey = args[0] ? args[0].toLowerCase() : 'birac';

    const selectedConfig = configsMap[targetSourceKey];

    if (!selectedConfig) {
        logger.error(`Unknown source key "${targetSourceKey}".`);
        logger.info(`Available keys: ${Object.keys(configsMap).join(', ')}`);
        process.exit(1);
    }

    logger.info(`Testing single source: ${selectedConfig.name}`);

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/founderpilot';
    const dbName = process.env.MONGODB_DB_NAME || 'founderpilot';
    const collectionName = process.env.MONGODB_COLLECTION || 'documents';

    const client = new MongoClient(mongoUri, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000
    });

    try {
        await client.connect();
        const dbCollection = client.db(dbName).collection(collectionName);
        const stats = await crawlSource(selectedConfig, dbCollection, `test_${Date.now()}`);
        logger.success(`Test crawl completed for ${selectedConfig.name}! Stats:`, stats);
    } catch (err) {
        logger.error(`Error during single source test: ${err.message}`, err);
    } finally {
        await client.close();
    }
}

runSingleSourceTest();
