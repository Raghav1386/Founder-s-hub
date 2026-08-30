export default {
    name: "MongoDB for Startups",
    provider: "MongoDB",
    opportunityType: "cloud_credit",
    baseUrl: "https://www.mongodb.com/startups",
    startUrls: [
        "https://www.mongodb.com/startups",
        "https://www.mongodb.com/startups/benefits",
        "https://www.mongodb.com/startups/faq"
    ],
    allowedDomains: [
        "www.mongodb.com",
        "mongodb.com"
    ],
    includePatterns: [
        "startups",
        "benefits",
        "credits",
        "atlas",
        "eligibility",
        "faq"
    ],
    excludePatterns: [
        "login",
        "cloud.mongodb.com",
        "dashboard",
        "pricing",
        "docs",
        "news",
        "careers",
        "privacy",
        "terms",
        "download"
    ],
    followLinks: true,
    maxDepth: 2,
    crawlFrequency: "weekly",
    tags: [
        "cloud_credit",
        "mongodb",
        "atlas",
        "startup",
        "credits"
    ]
};
