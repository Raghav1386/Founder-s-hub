export default {
    name: "Microsoft for Startups",
    provider: "Microsoft",
    opportunityType: "cloud_credit",
    baseUrl: "https://www.microsoft.com/en-us/startups",
    startUrls: [
        "https://www.microsoft.com/en-us/startups",
        "https://www.microsoft.com/en-us/startups/benefits",
        "https://www.microsoft.com/en-us/startups/faq"
    ],
    allowedDomains: [
        "www.microsoft.com",
        "microsoft.com"
    ],
    includePatterns: [
        "startups",
        "benefits",
        "credits",
        "azure",
        "founders-hub",
        "faq",
        "eligibility"
    ],
    excludePatterns: [
        "login",
        "signin",
        "portal",
        "dashboard",
        "pricing",
        "docs",
        "news",
        "careers",
        "privacy",
        "terms",
        "store",
        "buy",
        "software",
        "blog",
        "wp-json",
        "wp-content",
        "comments",
        "topic",
        "content-type"
    ],
    followLinks: true,
    maxDepth: 1,
    crawlFrequency: "weekly",
    tags: [
        "cloud_credit",
        "microsoft",
        "azure",
        "startup",
        "founders_hub"
    ]
};
