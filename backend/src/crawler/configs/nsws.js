export default {
    name: "NSWS - National Single Window System",
    baseUrl: "https://www.nsws.gov.in",
    startUrls: [
        "https://www.nsws.gov.in/about-us",
        "https://www.nsws.gov.in/faqs",
        "https://www.nsws.gov.in/portal/approvalsandregistrations",
        "https://www.nsws.gov.in/state-list",
        "https://www.nsws.gov.in/portal/scheme/ethanol-policy",
        "https://www.nsws.gov.in/portal/scheme/leather-scheme",
        "https://www.nsws.gov.in/portal/scheme/greenhydrogenpolicy",
        "https://www.nsws.gov.in/portal/scheme/pli-scheme",
        "https://www.nsws.gov.in/portal/scheme/scrappagepolicy",
        "https://www.nsws.gov.in/portal/user-guide",
        "https://www.nsws.gov.in/iem-details"
    ],
    allowedDomains: [
        "nsws.gov.in",
        "www.nsws.gov.in"
    ],
    excludePatterns: [
        "/login",
        "/contact-us",
        "/help-desk",
        "/query-feedback",
        "/website-policies",
        "/site-map",
        "/search",
        "#"
    ],
    followLinks: true,
    maxDepth: 2,
    crawlFrequency: "weekly",
    tags: [
        "startup",
        "government",
        "india",
        "single-window-system",
        "business-approval",
        "registration",
        "compliance",
        "central-scheme",
        "state-scheme",
        "policy",
        "dpiit",
        "invest-india"
    ]
}