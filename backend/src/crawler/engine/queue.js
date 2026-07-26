/**
 * queue.js
 * 
 * Purpose:
 * Provides a simple First-In, First-Out (FIFO) Queue data structure for the crawler.
 * The queue manages the URLs waiting to be crawled in sequential order.
 * 
 * Each item in the queue represents a web page to visit and has the following structure:
 * {
 *   url: "https://example.gov.in/page", // The web address to crawl
 *   depth: 0,                           // How deep this link is from the starting page
 *   discoveredFrom: "https://example.gov.in" // The parent URL where this link was found
 * }
 */

export class Queue {
    /**
     * Initializes an empty queue using a standard JavaScript array.
     */
    constructor() {
        // Internal array holding all queue items
        this.items = [];
    }

    /**
     * Adds a new item to the back (end) of the queue.
     * 
     * @param {Object} item - The queue item object
     * @param {string} item.url - The target URL to crawl
     * @param {number} item.depth - The crawl depth of this URL
     * @param {string|null} item.discoveredFrom - The URL where this link was discovered
     */
    enqueue(item) {
        // Validate basic structure to prevent invalid items in queue
        if (!item || typeof item.url !== 'string') {
            throw new Error('Invalid queue item: Must provide an object with a valid "url" string.');
        }

        // Push the item to the end of the items array
        this.items.push({
            url: item.url,
            depth: item.depth ?? 0,
            discoveredFrom: item.discoveredFrom ?? null
        });
    }

    /**
     * Removes and returns the item at the front (start) of the queue.
     * 
     * @returns {Object|null} The next item to process, or null if the queue is empty.
     */
    dequeue() {
        // Check if queue has items before dequeuing
        if (this.isEmpty()) {
            return null;
        }

        // shift() removes the first element from the array and returns it (FIFO behavior)
        return this.items.shift();
    }

    /**
     * Checks whether the queue has any remaining items.
     * 
     * @returns {boolean} True if empty, false if there are items to process.
     */
    isEmpty() {
        // Queue is empty when the length of items array is 0
        return this.items.length === 0;
    }

    /**
     * Helper method to get the current number of items in the queue.
     * 
     * @returns {number} Count of items currently queued.
     */
    size() {
        return this.items.length;
    }
}

export default Queue;
