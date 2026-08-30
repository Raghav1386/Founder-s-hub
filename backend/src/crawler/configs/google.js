export default {
    name: "Google for Startups Cloud Program",
    provider: "Google",
    opportunityType: "cloud_credit",
    baseUrl: "https://cloud.google.com/startup",
    startUrls: [
        "https://cloud.google.com/startup",
        "https://cloud.google.com/startup/benefits",
        "https://cloud.google.com/startup/ai",
        "https://cloud.google.com/startup/faq"
    ],
    allowedDomains: [
        "cloud.google.com",
        "startup.google.com"
    ],
    includePatterns: [
        "startup",
        "benefits",
        "credits",
        "ai",
        "eligibility",
        "faq",
        "tier"
    ],
    excludePatterns: [
        "login",
        "console",
        "dashboard",
        "pricing",
        "docs",
        "blogs",
        "news",
        "careers",
        "privacy",
        "terms",
        "products",
        "solutions"
    ],
    followLinks: true,
    maxDepth: 2,
    crawlFrequency: "weekly",
    tags: [
        "cloud_credit",
        "google",
        "gcp",
        "startup",
        "ai"
    ]
};
