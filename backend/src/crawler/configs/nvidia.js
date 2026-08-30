export default {
    name: "NVIDIA Inception",
    provider: "NVIDIA",
    opportunityType: "cloud_credit",
    baseUrl: "https://www.nvidia.com/en-us/startups/",
    startUrls: [
        "https://www.nvidia.com/en-us/startups/",
        "https://www.nvidia.com/en-us/startups/benefits/",
        "https://www.nvidia.com/en-us/startups/faq/"
    ],
    allowedDomains: [
        "www.nvidia.com",
        "nvidia.com"
    ],
    includePatterns: [
        "startups",
        "inception",
        "benefits",
        "credits",
        "gpu",
        "ai",
        "eligibility",
        "faq"
    ],
    excludePatterns: [
        "login",
        "dashboard",
        "store",
        "products",
        "drivers",
        "news",
        "careers",
        "privacy",
        "terms",
        "docs",
        "solutions",
        "deep-learning-ai",
        "data-center",
        "industries",
        "software"
    ],
    followLinks: true,
    maxDepth: 1,
    crawlFrequency: "weekly",
    tags: [
        "cloud_credit",
        "nvidia",
        "inception",
        "ai",
        "gpu",
        "credits"
    ]
};
