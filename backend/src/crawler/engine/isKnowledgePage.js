/**
 * isKnowledgePage.js
 * 
 * Purpose:
 * Evaluates whether a crawled web page contains genuine knowledge/informational content
 * (such as schemes, policies, guidelines, funding details, reports, FAQs)
 * or if it is merely a non-knowledge UI page (forms, dashboards, authentication, profiles).
 * 
 * Responsibilities:
 * 1. Score the URL based on knowledge indicators (+2) vs non-knowledge indicators (-5).
 * 2. Score the page Title based on knowledge keywords (+2) vs UI/auth keywords (-5).
 * 3. Score the Markdown content based on length and presence of key scheme/policy indicators.
 * 4. Sum up scores and return true if total score meets or exceeds the minimum threshold (default: 1).
 */

// ============================================================================
// STEP 1: Pattern Definitions
// ============================================================================

/** Keywords in URL indicating high-value knowledge content (+2 points) */
const KNOWLEDGE_URL_PATTERNS = [
    'scheme', 'policy', 'guideline', 'startup', 'fund', 'finance', 'loan',
    'subsidy', 'blog', 'article', 'challenge', 'initiative', 'notification',
    'circular', 'faq', 'resource', 'report', 'publication', 'offering',
    'incentive', 'opportunity', 'benefit', 'programme', 'program'
];

/** Keywords in URL indicating UI, authentication, or non-knowledge forms (-5 points) */
const NON_KNOWLEDGE_URL_PATTERNS = [
    'login', 'logout', 'register', 'signup', 'dashboard', 'profile',
    'settings', 'password', 'privacy', 'terms', 'sitemap', 'feedback',
    'contact', 'subscribe', 'search', 'verify', 'certificate',
    'download-certificate', 'otp', 'digilocker', 'create-password',
    'reset-password', 'account', 'modal', 'popup', 'grievance', 'careers',
    'tenders', 'captcha', 'auth'
];

/** Title keywords indicating useful knowledge content (+2 points) */
const KNOWLEDGE_TITLE_PATTERNS = [
    /scheme/i, /guidelines?/i, /policy/i, /initiative/i, /fund(ing)?/i,
    /subsidy/i, /program(me)?/i, /portal/i, /faq/i, /overview/i,
    /report/i, /details?/i, /benefits?/i, /resource/i, /incentives?/i,
    /opportunity/i, /offerings?/i, /support/i
];

/** Title keywords indicating non-knowledge UI / authentication pages (-5 points) */
const NON_KNOWLEDGE_TITLE_PATTERNS = [
    /login/i, /register/i, /sign\s*in/i, /sign\s*up/i, /dashboard/i,
    /profile/i, /my\s*account/i, /password/i, /otp/i, /verification/i,
    /grievance/i, /contact\s*us/i, /privacy\s*policy/i, /terms\s*of\s*use/i,
    /error/i, /404/i, /access\s*denied/i, /modal/i, /popup/i
];

/** Markdown keywords indicating rich scheme / policy / knowledge content (+2 points) */
const KNOWLEDGE_CONTENT_PATTERNS = [
    /eligibility/i, /benefits?/i, /application\s+process/i, /subsidy/i,
    /incentives?/i, /objective/i, /overview/i, /financial\s+assistance/i,
    /quantum\s+of\s+assistance/i, /nodal\s+agency/i, /guidelines?/i
];

/** Markdown keywords indicating interactive forms, auth modals, or login screens (-5 points) */
const NON_KNOWLEDGE_CONTENT_PATTERNS = [
    /create\s+password/i, /enter\s+captcha/i, /confirm\s+password/i,
    /enter\s+otp/i, /login\s+to\s+your\s+account/i, /forgot\s+password/i,
    /user\s+registration/i, /sign\s+up\s+for\s+an\s+account/i, /enter\s+mobile\s+number/i
];

// ============================================================================
// STEP 2: Main Scoring Function
// ============================================================================

/**
 * Evaluates whether a page contains valuable knowledge content for RAG indexing.
 * 
 * @param {Object} page 
 * @param {string} page.url - Page URL string
 * @param {string} [page.title] - Page title string
 * @param {string} [page.markdown] - Cleaned page markdown content
 * @param {number} [threshold=1] - Minimum score required to pass as a knowledge page
 * 
 * @returns {boolean} True if page is likely a knowledge document, false otherwise
 */
export function isKnowledgePage(page = {}, threshold = 1) {
    const url = (page.url || '').toLowerCase();
    const title = (page.title || '').trim();
    const markdown = (page.markdown || '').trim();

    let score = 0;

    // ------------------------------------------------------------------------
    // 1. URL Pattern Scoring
    // ------------------------------------------------------------------------
    for (const pattern of KNOWLEDGE_URL_PATTERNS) {
        if (url.includes(pattern)) {
            score += 2;
            break; // Apply bonus once for URL match
        }
    }

    for (const pattern of NON_KNOWLEDGE_URL_PATTERNS) {
        if (url.includes(pattern)) {
            score -= 5;
            break; // Apply penalty once for URL match
        }
    }

    // ------------------------------------------------------------------------
    // 2. Title Pattern Scoring
    // ------------------------------------------------------------------------
    if (title) {
        for (const pattern of KNOWLEDGE_TITLE_PATTERNS) {
            if (pattern.test(title)) {
                score += 2;
                break;
            }
        }

        for (const pattern of NON_KNOWLEDGE_TITLE_PATTERNS) {
            if (pattern.test(title)) {
                score -= 5;
                break;
            }
        }
    }

    // ------------------------------------------------------------------------
    // 3. Markdown Content & Length Scoring
    // ------------------------------------------------------------------------
    const markdownLength = markdown.length;

    // Length-based scoring
    if (markdownLength > 500) {
        score += 1;
    } else if (markdownLength < 150) {
        score -= 5;
    }

    // Content keyword checks
    if (markdownLength > 0) {
        for (const pattern of KNOWLEDGE_CONTENT_PATTERNS) {
            if (pattern.test(markdown)) {
                score += 2;
                break;
            }
        }

        for (const pattern of NON_KNOWLEDGE_CONTENT_PATTERNS) {
            if (pattern.test(markdown)) {
                score -= 5;
                break;
            }
        }
    }

    // ------------------------------------------------------------------------
    // 4. Threshold Check
    // ------------------------------------------------------------------------
    return score >= threshold;
}

export default isKnowledgePage;
