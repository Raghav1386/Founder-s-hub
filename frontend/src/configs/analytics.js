/**
 * analytics.js (frontend/src/configs/analytics.js)
 * 
 * Purpose:
 * Custom event tracking helper for Google Analytics 4 (GA4).
 */

export const GA_MEASUREMENT_ID = 'G-6JZ0JRSSP8';

/**
 * Sends custom conversion/interaction events to Google Analytics
 * @param {string} eventName Name of the event (e.g. 'wizard_started', 'analysis_completed', 'scheme_viewed')
 * @param {Object} eventParams Additional parameters (e.g. { schemeName, score, stage })
 */
export function trackEvent(eventName, eventParams = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
    }
  } catch (err) {
    console.warn('⚠️ Analytics tracking note:', err.message);
  }
}

export default trackEvent;
