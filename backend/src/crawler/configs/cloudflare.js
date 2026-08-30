export default {
    name: "Cloudflare for Startups",
    provider: "Cloudflare",
    opportunityType: "cloud_credit",
    baseUrl: "https://www.cloudflare.com/startups/",
    startUrls: [
        "https://www.cloudflare.com/startups/",
        "https://www.cloudflare.com/startups/faq/"
    ],
    allowedDomains: [
        "www.cloudflare.com",
        "cloudflare.com"
    ],
    includePatterns: [
        "startups",
        "benefits",
        "credits",
        "workers",
        "eligibility",
        "faq"
    ],
    excludePatterns: [
        "login",
        "dash.cloudflare.com",
        "dashboard",
        "pricing",
        "docs",
        "blog",
        "careers",
        "privacy",
        "terms"
    ],
    followLinks: true,
    maxDepth: 2,
    crawlFrequency: "weekly",
    tags: [
        "cloud_credit",
        "cloudflare",
        "startup",
        "credits"
    ]
};
