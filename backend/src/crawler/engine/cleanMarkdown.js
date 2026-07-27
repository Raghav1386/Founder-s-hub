/**
 * cleanMarkdown.js
 * 
 * Purpose:
 * Pre-processes and cleans raw markdown content extracted by Crawl4AI / HTTP fetcher
 * before storing the document in MongoDB.
 * 
 * Responsibilities:
 * 1. Decode HTML entities (&amp;, &#39;, &nbsp;, etc.).
 * 2. Strip UI chrome: navigation bars, login/register modals, headers, footers, language selectors.
 * 3. Remove common government portal boilerplate (copyright, accessibility bars, sitemap links).
 * 4. Apply source-specific cleaning rules for registered site configurations.
 * 5. Normalize whitespace, remove duplicate repeated lines, and collapse consecutive blank lines.
 */

// ============================================================================
// STEP 1: HTML Entity Decoder Map & Helper
// ============================================================================
const ENTITY_MAP = {
    'amp': '&',
    '39': "'",
    'apos': "'",
    'nbsp': ' ',
    '160': ' ',
    'quot': '"',
    'lt': '<',
    'gt': '>',
    'copy': '',
    'reg': '',
    'trade': '',
    '8217': "'",
    '8216': "'",
    '8211': '-',
    '8212': '—',
    'ndash': '-',
    'mdash': '—',
    'bull': '•'
};

/**
 * Replaces common HTML entities with their text representation.
 * @param {string} text 
 * @returns {string}
 */
function decodeHtmlEntities(text) {
    if (!text) return '';
    return text.replace(/&(#?[a-z0-9]+);/gi, (match, entity) => {
        const key = entity.toLowerCase().replace('#', '');
        return ENTITY_MAP[key] ?? match;
    });
}

// ============================================================================
// STEP 2: Reusable Generic UI / Boilerplate Exclusion Patterns
// ============================================================================

/**
 * Line patterns matching obvious navigation headers, accessibility bars, and top bars.
 */
const NAVIGATION_PATTERNS = [
    /^#+\s*(main\s+)?navigation$/i,
    /^\s*skip\s+to\s+main\s+content\s*$/i,
    /^\s*screen\s+reader\s+access\s*$/i,
    /^\s*toggle\s+navigation\s*$/i,
    /^\s*site\s*map\s*$/i,
    /^\s*sitemap\s*$/i,
    /^\s*quick\s+links\s*$/i,
    /^\s*important\s+links\s*$/i,
    /^\s*home\s*[\/|>|•|-]\s*[a-z0-9_\s-]+\s*$/i,
    /^\s*breadcrumb\s*$/i
];

/**
 * Line patterns matching login, registration, and user dashboard UI elements.
 */
const AUTH_AND_USER_PATTERNS = [
    /^\s*(user\s+)?login\s*$/i,
    /^\s*sign\s+in\s*$/i,
    /^\s*sign\s+up(\s*\/\s*register)?(\s+here)?\s*$/i,
    /^\s*register\s+(now|here)?\s*$/i,
    /^\s*forgot\s+password\??\s*$/i,
    /^\s*enter\s+(otp|captcha)\s*$/i,
    /^\s*my\s+account\s*$/i,
    /^\s*my\s+dashboard\s*$/i,
    /^\s*user\s+profile\s*$/i,
    /^\s*logout\s*$/i,
    /^\s*welcome,?\s+[a-z0-9_\s.]+\s*$/i
];

/**
 * Line patterns matching language selection bars and accessibility controls.
 */
const LANGUAGE_PATTERNS = [
    /select\s+language/i,
    /language\s*:/i,
    /(english|hindi)\s*\|\s*(hindi|english)/i,
    /^\s*हिन्दी\s*$/i,
    /font\s+size\s*:/i,
    /^\s*a\+\s*a\s*a-\s*$/i
];

/**
 * Line patterns matching footers, copyright notices, and generic government website disclaimers.
 */
const FOOTER_AND_COPYRIGHT_PATTERNS = [
    /^\s*copyright\s+©.*$/i,
    /^\s*all\s+rights\s+reserved\.?\s*$/i,
    /^\s*privacy\s+policy\s*$/i,
    /^\s*terms\s+of\s+use\s*$/i,
    /^\s*terms\s+&\s+conditions\s*$/i,
    /^\s*disclaimer\s*$/i,
    /^\s*website\s+policies\s*$/i,
    /^\s*hyperlinking\s+policy\s*$/i,
    /^\s*copyright\s+policy\s*$/i,
    /^\s*last\s+updated\s*(on)?:.*$/i,
    /^\s*visitor\s+count\s*:?.*$/i,
    /^\s*page\s+last\s+updated.*$/i,
    /^\s*designed\s+(&|and)\s+developed\s+by.*$/i,
    /^\s*hosted\s+by\s+national\s+informatics\s+centre.*$/i
];

/**
 * Combined list of generic line-level filters.
 */
const GENERIC_EXCLUDE_PATTERNS = [
    ...NAVIGATION_PATTERNS,
    ...AUTH_AND_USER_PATTERNS,
    ...LANGUAGE_PATTERNS,
    ...FOOTER_AND_COPYRIGHT_PATTERNS
];

// ============================================================================
// STEP 3: Source-Specific Cleaning Rules
// ============================================================================

const SOURCE_SPECIFIC_RULES = {
    'StartupIndia': [
        /^\s*startup\s+india\s+hub\s*$/i,
        /^\s*recognized\s+by\s+dpiit\s*$/i,
        /^\s*bhaskar\s+portal\s*$/i,
        /^\s*dpiit\s+recognition\s+portal\s*$/i,
        /^\s*national\s+startup\s+advisory\s+council\s*$/i,
        /^\s*ministry\s+of\s+commerce\s+and\s+industry\s*$/i
    ],
    'SIDBI': [
        /^\s*small\s+industries\s+development\s+bank\s+of\s+india\s*$/i,
        /^\s*customer\s+care\s+toll\s+free.*$/i,
        /^\s*branch\s+locator\s*$/i,
        /^\s*right\s+to\s+information\s*$/i,
        /^\s*rti\s+disclosures?\s*$/i
    ],
    'MSME': [
        /^\s*ministry\s+of\s+micro,?\s+small\s+(&|and)\s+medium\s+enterprises\s*$/i,
        /^\s*udyam\s+registration\s+portal\s*$/i,
        /^\s*champions\s+portal\s*$/i,
        /^\s*samadhaan\s+portal\s*$/i,
        /^\s*sambandh\s+portal\s*$/i
    ],
    'DPIIT': [
        /^\s*department\s+for\s+promotion\s+of\s+industry\s+and\s+internal\s+trade\s*$/i,
        /^\s*public\s+grievances?\s*$/i,
        /^\s*gazette\s+notifications?\s*$/i
    ],
    'GeM_GovernmentEMarketplace': [
        /^\s*government\s+e-marketplace\s*$/i,
        /^\s*buyer\s+login\s*$/i,
        /^\s*seller\s+login\s*$/i,
        /^\s*incident\s+management\s*$/i,
        /^\s*search\s+categories?\s*$/i
    ],
    'invest-india': [
        /^\s*national\s+investment\s+promotion\s+and\s+facilitation\s+agency\s*$/i,
        /^\s*make\s+in\s+india\s*$/i,
        /^\s*incentives\s+manager\s*$/i
    ],
    'Atal Innovation Mission': [
        /^\s*atal\s+innovation\s+mission\s*$/i,
        /^\s*niti\s+aayog\s*$/i,
        /^\s*atl\s+dashboard\s*$/i,
        /^\s*aic\s+portal\s*$/i
    ],
    'MeitY Startup Hub': [
        /^\s*meity\s+startup\s+hub\s*$/i,
        /^\s*ministry\s+of\s+electronics\s+and\s+information\s+technology\s*$/i
    ],
    'NSWS - National Single Window System': [
        /^\s*national\s+single\s+window\s+system\s*$/i,
        /^\s*know\s+your\s+approvals\s*$/i,
        /^\s*central\s+approvals\s*$/i
    ]
};

// ============================================================================
// STEP 4: Main Clean Markdown Function
// ============================================================================

/**
 * Cleans raw extracted markdown by stripping HTML entities, navigation bars,
 * login modals, footers, boilerplate, and repeated duplicate lines.
 * 
 * @param {string} markdown - Raw markdown or plain text extracted from web page
 * @param {string} [source=""] - Source identifier (e.g. "StartupIndia", "SIDBI", "MSME")
 * @returns {string} Cleaned markdown text ready for storage and vector embedding
 */
export function cleanMarkdown(markdown = '', source = '') {
    if (!markdown || typeof markdown !== 'string') {
        return '';
    }

    // 1. Decode common HTML entities
    let text = decodeHtmlEntities(markdown);

    // 2. Split into individual lines for line-by-line processing
    const rawLines = text.split(/\r?\n/);
    const cleanedLines = [];

    // Get source-specific rules if available
    const sourceRules = SOURCE_SPECIFIC_RULES[source] || [];

    // Track previous non-empty line to filter out consecutive duplicate lines
    let lastNonEmptyLine = '';

    for (let i = 0; i < rawLines.length; i++) {
        // Normalize inner spaces in current line
        let line = rawLines[i].replace(/[ \t]+/g, ' ').trim();

        // Skip completely empty lines if previous added line was also blank
        if (!line) {
            if (cleanedLines.length > 0 && cleanedLines[cleanedLines.length - 1] !== '') {
                cleanedLines.push('');
            }
            continue;
        }

        // 3. Test line against generic boilerplate / UI chrome patterns
        const isGenericBoilerplate = GENERIC_EXCLUDE_PATTERNS.some(pattern => pattern.test(line));
        if (isGenericBoilerplate) {
            continue;
        }

        // 4. Test line against source-specific rules
        const isSourceBoilerplate = sourceRules.some(pattern => pattern.test(line));
        if (isSourceBoilerplate) {
            continue;
        }

        // 5. Skip duplicate consecutive lines (common in repeated nav headers/footers)
        if (line === lastNonEmptyLine && line.length < 100) {
            continue;
        }

        lastNonEmptyLine = line;
        cleanedLines.push(line);
    }

    // 6. Join lines and trim leading/trailing blank space
    let cleanedText = cleanedLines.join('\n').trim();

    // 7. Collapse 3+ consecutive blank lines down to a double newline
    cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n');

    return cleanedText;
}

export default cleanMarkdown;
