export default {
    name: "Oracle for Startups",
    provider: "Oracle",
    opportunityType: "cloud_credit",
    baseUrl: "https://www.oracle.com/startup/",
    startUrls: [
        "https://www.oracle.com/startup/",
        "https://www.oracle.com/startup/benefits.html",
        "https://www.oracle.com/startup/faq.html"
    ],
    allowedDomains: [
        "www.oracle.com",
        "oracle.com"
    ],
    includePatterns: [
        "startup",
        "benefits",
        "credits",
        "oci",
        "cloud",
        "eligibility",
        "faq"
    ],
    excludePatterns: [
        "login",
        "cloud.oracle.com",
        "dashboard",
        "pricing",
        "docs",
        "news",
        "careers",
        "privacy",
        "terms",
        "products"
    ],
    followLinks: true,
    maxDepth: 2,
    crawlFrequency: "weekly",
    tags: [
        "cloud_credit",
        "oracle",
        "oci",
        "startup",
        "credits"
    ]
};
