export default {
    name: "DigitalOcean Hatch",
    provider: "DigitalOcean",
    opportunityType: "cloud_credit",
    baseUrl: "https://www.digitalocean.com/hatch",
    startUrls: [
        "https://www.digitalocean.com/hatch",
        "https://www.digitalocean.com/hatch/faq"
    ],
    allowedDomains: [
        "www.digitalocean.com",
        "digitalocean.com"
    ],
    includePatterns: [
        "hatch",
        "startups",
        "benefits",
        "credits",
        "eligibility",
        "faq"
    ],
    excludePatterns: [
        "login",
        "cloud.digitalocean.com",
        "dashboard",
        "pricing",
        "docs",
        "community",
        "careers",
        "privacy",
        "terms"
    ],
    followLinks: true,
    maxDepth: 2,
    crawlFrequency: "weekly",
    tags: [
        "cloud_credit",
        "digitalocean",
        "hatch",
        "startup",
        "credits"
    ]
};
