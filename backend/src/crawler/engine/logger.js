/**
 * logger.js
 * 
 * Purpose:
 * Provides a very simple, lightweight logging utility for the crawler.
 * Formats console log outputs with timestamps and status tags so crawler execution
 * is easy to follow in real-time in the terminal.
 * 
 * Includes methods:
 * - info(message, metadata)
 * - success(message, metadata)
 * - warning(message, metadata)
 * - error(message, errorObject)
 */

/**
 * Formats the current local date and time as an ISO string for log timestamps.
 * 
 * @returns {string} Formatted timestamp string e.g., "2026-07-27T00:51:30"
 */
function getTimestamp() {
    // Return current ISO timestamp formatted nicely
    return new Date().toISOString();
}

export const logger = {
    /**
     * Logs standard informational messages (e.g. starting a crawl, processing page).
     * 
     * @param {string} message - Description of the informational event
     * @param {Object} [details] - Optional extra details object to print
     */
    info(message, details = null) {
        const timestamp = getTimestamp();
        const tag = '[INFO]';
        
        if (details) {
            console.log(`${timestamp} ${tag} ${message}`, details);
        } else {
            console.log(`${timestamp} ${tag} ${message}`);
        }
    },

    /**
     * Logs positive outcomes (e.g. document saved, crawl finished successfully).
     * 
     * @param {string} message - Description of the successful action
     * @param {Object} [details] - Optional extra details object to print
     */
    success(message, details = null) {
        const timestamp = getTimestamp();
        const tag = '[SUCCESS]';

        if (details) {
            console.log(`${timestamp} ${tag} ${message}`, details);
        } else {
            console.log(`${timestamp} ${tag} ${message}`);
        }
    },

    /**
     * Logs potential issues or non-fatal anomalies (e.g. skipped duplicate link, max depth reached).
     * 
     * @param {string} message - Description of the warning condition
     * @param {Object} [details] - Optional extra details object to print
     */
    warning(message, details = null) {
        const timestamp = getTimestamp();
        const tag = '[WARNING]';

        if (details) {
            console.log(`${timestamp} ${tag} ${message}`, details);
        } else {
            console.log(`${timestamp} ${tag} ${message}`);
        }
    },

    /**
     * Logs errors or failures (e.g. HTTP request failure, Mongo DB write error).
     * 
     * @param {string} message - High-level error summary
     * @param {Error|Object} [errorObj] - The actual error object or details
     */
    error(message, errorObj = null) {
        const timestamp = getTimestamp();
        const tag = '[ERROR]';

        if (errorObj) {
            console.error(`${timestamp} ${tag} ${message}`, errorObj);
        } else {
            console.error(`${timestamp} ${tag} ${message}`);
        }
    }
};

export default logger;
